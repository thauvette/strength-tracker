import { h } from 'preact';
import dayjs from 'dayjs';
import EditableSet from '../editableSet/editableSet.tsx';
import SetNoteForm from '../setNoteForm/SetNoteForm';
import { formatToFixed } from '../../utilities.js/formatNumbers';

const SetRowDrawer = ({
  set,
  drawerContent,
  onChangeSet,
  closeDrawer,
  handleUpdateSet,
  handleDeleteSet,
}) => {
  if (!drawerContent) {
    return null;
  }

  if (drawerContent === 'edit') {
    return (
      <EditableSet
        reps={set.reps}
        weight={set.weight}
        isWarmUp={set.isWarmUp}
        renderCtas={(data) => {
          return (
            <div class="flex">
              <div class="flex-1 text-center pr-1">
                <button
                  class="primary w-full"
                  onClick={() => {
                    handleUpdateSet({
                      weight: data.weight,
                      reps: data.reps,
                      id: set.id,
                      isWarmUp: data.isWarmUp,
                    });
                  }}
                >
                  Update
                </button>
              </div>
              <div class="flex-1  text-center pl-1">
                <button class="secondary w-full" onClick={closeDrawer}>
                  Cancel
                </button>
              </div>
            </div>
          );
        }}
      />
    );
  }
  if (drawerContent === 'note') {
    // text, onSave, id
    return <SetNoteForm id={set.id} text={set.note} onSave={onChangeSet} />;
  }

  if (drawerContent === 'delete') {
    return (
      <div class="py-4">
        <p>Are you sure you want to delete this set?</p>
        <p>This action can not be undone</p>
        <div class="flex pt-4">
          <div class="flex-1 text-center pr-1">
            <button class="warning w-full" onClick={handleDeleteSet}>
              Yup, ditch it.
            </button>
          </div>
          <div class="flex-1 text-center pl-1">
            <button onClick={closeDrawer} class="secondary w-full">
              Nope, keep it.
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (drawerContent === 'stats') {
    return (
      <div class="text-lg">
        <div class="flex justify-between py-2 border-b">
          <p>Logged:</p>
          <p class="text-right">
            {dayjs(set.created).format('MMM DD, YYYY h:mm a')}
          </p>
        </div>

        {set.updated && (
          <div class="flex justify-between py-2 border-b">
            <p>Updated:</p>
            <p class="text-right">
              {dayjs(set.updated).format('MMM DD, YYYY h:mm a')}
            </p>
          </div>
        )}
        <div class="flex justify-between py-2 border-b">
          <p>Estimated one rep max:</p>
          <p class="text-right">{set.estOneRepMax}</p>
        </div>

        {set.bw ? (
          <div class="flex justify-between py-2 border-b">
            <p>% body weight:</p>
            <p class="text-right">
              {formatToFixed((set.weight / set.bw) * 100)}
            </p>
          </div>
        ) : null}
        <div class="flex justify-between py-2 border-b">
          <p>single set volume:</p>
          <p class="text-right">{formatToFixed(set.weight * set.reps)}</p>
        </div>
        {set.note && (
          <div class="py-2">
            <p>Note:</p>
            <p>{set.note}</p>
          </div>
        )}
      </div>
    );
  }

  return null;
};
export default SetRowDrawer;
