import { h } from 'preact';
import { useState } from 'preact/hooks';
import dayjs from 'dayjs';
import { cloneDeep } from 'lodash';
import Router from 'preact-router';
import { Link } from 'preact-router/match';

import dateFormats from '../../config/dateFormats';
import BioMetricForm from './bioMetricForm';

import Modal from '../modal/Modal';
import Icon from '../icon/Icon';
import { routes } from '../../config/routes';
import Days from './Days';
import Weeks from './Weeks';
import Charts from './Charts';
import Sync from './Sync';

const BioMetric = ({
  id,
  addEntry,
  bioMetrics,
  editEntry,
  removeEntry,
  remaining_path,
}) => {
  const currentBioMetric = bioMetrics[id];

  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    id: null,
  });
  const [editModalState, setEditModalState] = useState({
    isOpen: false,
    item: null,
  });
  const closeEditModal = () => {
    setEditModalState({
      isOpen: false,
      item: null,
    });
  };
  const deleteModalItem = currentBioMetric?.items?.find(
    (item) => item.id === deleteModalState.id,
  );
  const closeDeleteModal = () =>
    setDeleteModalState({
      open: false,
      id: null,
    });

  const handleAddEntry = (data) => {
    addEntry({
      bioMetricId: id,
      data,
    });
  };
  const sortedItems = cloneDeep(currentBioMetric?.items || [])?.sort(
    (a, b) =>
      dayjs(a.date).toDate().getTime() - dayjs(b.date).toDate().getTime(),
  );
  const groupedItems = sortedItems?.reduce((obj, item, index) => {
    const dayKey = dayjs(item.date).format('YYYY-MM-DD');

    const currentDayItems = obj[dayKey]?.items || [];

    const lastValue = sortedItems[index - 1]?.value;
    // if no last value the diff is 0
    const diff = item.value - (lastValue || item.value);
    currentDayItems.push({
      ...item,
      diff,
    });
    const total = currentDayItems
      .map((item) => +item.value)
      ?.reduce((num, value) => num + value, 0);

    let dayAverage;
    try {
      dayAverage = total / currentDayItems.length;
    } catch (err) {
      // ignore
    }
    return {
      ...obj,
      [dayKey]: {
        items: currentDayItems?.reverse(),
        average: dayAverage,
      },
    };
  }, {});

  const orderedKeys = Object.keys(groupedItems).sort((a, b) =>
    dayjs(a).isBefore(dayjs(b)) ? 1 : -1,
  );

  const days = orderedKeys?.map((dayKey, i) => {
    const { items, average } = groupedItems[dayKey];
    const previousDayKey = orderedKeys[i + 1];

    const previousData = previousDayKey ? groupedItems[previousDayKey] : null;

    const change = previousData?.average
      ? average - previousData?.average
      : undefined;

    return {
      dayKey,
      items,
      average,
      change,
    };
  });

  return (
    <div class="px-2">
      <div class="flex flex-col">
        <h1 class="capitalize">{currentBioMetric?.name}</h1>
        <div class="flex flex-wrap py-2">
          <Link
            class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 ${
              !remaining_path
                ? 'border-highlight-900 dark:border-highlight-200'
                : 'border-transparent'
            }`}
            href={`${routes.bioMetricsBase}/${id}`}
          >
            Days
          </Link>
          <Link
            class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 ${
              remaining_path === 'weeks'
                ? 'border-highlight-900 dark:border-highlight-200'
                : 'border-transparent'
            }`}
            href={`${routes.bioMetricsBase}/${id}/weeks`}
          >
            Weeks
          </Link>
          <Link
            class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 ${
              remaining_path === 'charts'
                ? 'border-highlight-900 dark:border-highlight-200'
                : 'border-transparent'
            }`}
            href={`${routes.bioMetricsBase}/${id}/charts`}
          >
            Charts
          </Link>
          <Link
            class={`px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-100 no-underline border-b-4 ${
              remaining_path === 'sync'
                ? 'border-highlight-900 dark:border-highlight-200'
                : 'border-transparent'
            }`}
            href={`${routes.bioMetricsBase}/${id}/sync`}
          >
            Export
          </Link>
        </div>
      </div>
      <Router>
        <Days
          path={`${routes.bioMetricsBase}/:id`}
          days={days}
          setEditModalState={setEditModalState}
          initialFormValues={{
            value:
              currentBioMetric?.items?.[currentBioMetric?.items.length - 1]
                ?.value || '',
          }}
          handleAddEntry={handleAddEntry}
          name={currentBioMetric?.name}
        />
        <Weeks path={`${routes.bioMetricsBase}/:id/weeks`} days={days} />
        <Charts path={`${routes.bioMetricsBase}/:id/charts`} days={days} />
        <Sync path={`${routes.bioMetricsBase}/:id/sync`} id={+id} />
      </Router>

      {deleteModalState.open && (
        <Modal onRequestClose={closeDeleteModal} isOpen={deleteModalState.open}>
          <h1 class="mb-4">Are you sure?</h1>
          <p class="mb-4">Confirm you want to delete this entry</p>
          <p class="mb-4">
            {currentBioMetric?.name}, {deleteModalItem?.value},{' '}
            {dayjs(deleteModalItem.date).format(dateFormats.displayShort)}
          </p>
          <div class="flex">
            <button
              class="btn warning flex-1 mr-1"
              onClick={() => {
                removeEntry(deleteModalState.id);
                closeDeleteModal();
              }}
            >
              Yup, ditch it
            </button>
            <button
              class="btn secondary flex-1 ml-1"
              onClick={closeDeleteModal}
            >
              Nope, keep it.
            </button>
          </div>
        </Modal>
      )}
      {editModalState.isOpen && (
        <Modal isOpen={editModalState.isOpen} onRequestClose={closeEditModal}>
          <div>
            <BioMetricForm
              submit={(data) => {
                editEntry(editModalState.item.id, data);
                closeEditModal();
              }}
              initialValues={{
                value: editModalState.item.value,
                date: dayjs(editModalState.item.date).format(dateFormats.day),
                time: dayjs(editModalState.item.date).format(dateFormats.time),
              }}
              name={currentBioMetric?.name}
              submitText="Update"
              renderCtas={({ submit }) => (
                <div class="flex gap-2 mt-8 pt-8 border-t-2 border-primary-100">
                  <button
                    className="flex-1 bg-primary-900 text-white"
                    onClick={submit}
                  >
                    <div className="flex items-center justify-center">
                      <Icon name="save-outline" />
                      <p class="ml-2">Update</p>
                    </div>
                  </button>
                  <button
                    className="flex-1 bg-red-900 text-white "
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteModalState({
                        id: editModalState.item.id,
                        open: true,
                      });
                      closeEditModal();
                    }}
                  >
                    <div className="flex items-center justify-center">
                      <Icon name="trash-outline" />
                      <p class="ml-2">Delete</p>
                    </div>
                  </button>
                </div>
              )}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default BioMetric;
