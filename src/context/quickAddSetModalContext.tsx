import { h } from 'preact';
import { useState, createContext, useContext } from 'preact/compat';
import dayjs from 'dayjs';

import { Exercise, HydratedSet } from './db/types';
import useDB from './db/db';
import { objectStores } from './db/config';
import Modal from '../components/modal/Modal';
import EditableSet from '../components/editableSet/editableSet.tsx';

import useToast from './toasts/Toasts';

const QuickAddSetModalContext = createContext<{
  launchQuickAdd: (exerciseId: number) => void;
}>(null);

export const QuickAddSetModalProvider = ({ children }) => {
  const { getItem, getSetsByDay, createOrUpdateLoggedSet } = useDB();
  const { fireToast } = useToast();
  const [state, setState] = useState<{
    isOpen: boolean;
    isLoading: boolean;
    data: Exercise | null;
    exerciseId: number | null;
  }>({
    isOpen: false,
    isLoading: false,
    data: null,
    exerciseId: null,
  });

  const [values, setValues] = useState<HydratedSet>(null);

  const launchQuickAdd = (id: number) => {
    setState({
      ...state,
      isLoading: true,
      isOpen: true,
      exerciseId: +id,
      data: null,
    });
    const promises = [
      getItem(objectStores.exercises, id),
      getSetsByDay(dayjs().format()),
    ];
    Promise.all(promises).then(([exerciseData, sets]) => {
      // get the last set and make it the default for the EditableSet
      const lastSet = sets
        .filter((set) => set.exercise === id)
        ?.reduce((obj, set) => {
          if (!obj.created || obj.created < set.created) {
            return set;
          }
          return obj;
        }, {});
      if (lastSet) {
        setValues(lastSet);
      }
      setState((current) => ({
        ...current,
        isLoading: false,
        data: exerciseData,
      }));
    });
  };

  const closeModal = () => {
    setState({
      isOpen: false,
      isLoading: false,
      data: null,
      exerciseId: null,
    });
  };

  const submit = async (newValues) => {
    await createOrUpdateLoggedSet(null, {
      ...newValues,
      exercise: +state.exerciseId,
    });
    fireToast({ text: `${state.data?.name} set added` });
    closeModal();
  };
  return (
    <QuickAddSetModalContext.Provider value={{ launchQuickAdd }}>
      <>
        {children}
        <Modal isOpen={state.isOpen} onRequestClose={closeModal}>
          {state.isLoading ? (
            'loading'
          ) : (
            <div>
              <h1 class="capitalize">{state.data?.name}</h1>
              <EditableSet
                isWarmUp={!!values?.isWarmUp}
                reps={values?.reps || 0}
                weight={values?.weight || 0}
                barWeight={state?.data?.barWeight}
                renderCtas={(newValues) => (
                  <button onClick={() => submit(newValues)}>Save</button>
                )}
              />
            </div>
          )}
        </Modal>
      </>
    </QuickAddSetModalContext.Provider>
  );
};

const useQuickSetAdd = () => useContext(QuickAddSetModalContext);

export default useQuickSetAdd;
