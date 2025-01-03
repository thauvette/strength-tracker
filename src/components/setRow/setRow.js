import { h } from 'preact';
import { useState } from 'preact/compat';
import AnimateHeight from 'react-animate-height';

import SetRowDrawer from './setRowDrawer';
import useDB from '../../context/db/db.tsx';
import { objectStores } from '../../context/db/config.ts';

import Icon from '../icon/Icon';

const SetRow = ({ set, onChangeSet, isIntersecting = true }) => {
  const { createOrUpdateLoggedSet, deleteEntry } = useDB();
  const updateExistingSet = async ({ weight, reps, id, isWarmUp }) => {
    await createOrUpdateLoggedSet(id, {
      ...set,
      weight,
      reps,
      isWarmUp,
    });
    if (onChangeSet) {
      onChangeSet();
    }
  };

  const deleteSet = async () => {
    await deleteEntry(objectStores.sets, set.id);
    if (onChangeSet) {
      onChangeSet();
    }
  };

  const [drawerState, setDrawerState] = useState({
    open: false,
    content: null, // one of note, edit, stats.
  });

  const closeDrawer = () => {
    setDrawerState({
      ...drawerState,
      open: false,
    });
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        setDrawerState({
          open: false,
          content: null,
        });
      }, 300);
    }
  };

  const handleToggleDrawerContent = (contentType) => {
    if (drawerState.open && drawerState.content === contentType) {
      closeDrawer();
    } else {
      setDrawerState({
        open: true,
        content: contentType,
      });
    }
  };

  return (
    <div class="py-2 border-b-2 border-gray-200 dark:border-gray-600">
      <div class="flex items-center justify-between ">
        {isIntersecting && (
          <button
            onClick={() => handleToggleDrawerContent('note')}
            aria-label="view notes"
          >
            <div class="flex items-center text-highlight-900 dark:text-highlight-100">
              <Icon
                name={set?.note?.length ? 'clipboard' : 'clipboard-outline'}
              />
            </div>
          </button>
        )}

        <p class="m-0 flex-1">
          {set.reps} @ {set.weight}{' '}
          {set.isWarmUp ? <span class="text-xs">(warm up)</span> : null}
        </p>
        {isIntersecting && (
          <div class="flex items-center">
            <button
              aria-label="view stats"
              onClick={() => handleToggleDrawerContent('stats')}
            >
              <div class="flex items-center">
                <Icon name="bar-chart-outline" />
              </div>
            </button>
            <button
              aria-label="delete set"
              onClick={() => handleToggleDrawerContent('delete')}
            >
              <div class="flex items-center">
                <Icon name="trash-outline" />
              </div>
            </button>
            <button
              onClick={() => handleToggleDrawerContent('edit')}
              aria-label="edit set"
            >
              <div class="flex items-center">
                <Icon name="create-outline" />
              </div>
            </button>
          </div>
        )}
      </div>
      {isIntersecting && (
        <AnimateHeight height={drawerState.open ? 'auto' : 0} duration={250}>
          <div class="px-4">
            <SetRowDrawer
              set={set}
              drawerContent={drawerState.content}
              onChangeSet={() => {
                if (onChangeSet) {
                  onChangeSet();
                }
                closeDrawer();
              }}
              closeDrawer={closeDrawer}
              handleUpdateSet={async ({ weight, reps, id, isWarmUp }) => {
                await updateExistingSet({
                  weight,
                  reps,
                  id,
                  isWarmUp,
                });
                closeDrawer();
              }}
              handleDeleteSet={deleteSet}
            />
          </div>
        </AnimateHeight>
      )}
    </div>
  );
};

export default SetRow;
