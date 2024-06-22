import { h } from 'preact';
import { useState, createContext, useContext } from 'preact/compat';

import useDB from './db/db';
import Modal from '../components/modal/Modal';
import EditableSet from '../components/editableSet/editableSet';

import useToast from './toasts/Toasts';

type ContextType = {
  launchQuickAdd: (args: {
    id: number;
    initialValues: {
      weight: number;
      reps: number;
      isWarmUp: boolean;
    };
    exerciseName: string;
  }) => void;
};

const QuickAddSetModalContext = createContext<ContextType>(null);

export const QuickAddSetModalProvider = ({ children }) => {
  const { createOrUpdateLoggedSet } = useDB();
  const { fireToast } = useToast();
  const [state, setState] = useState<{
    isOpen: boolean;
    exerciseId: number | null;
    exerciseName: string;
  }>({
    isOpen: false,
    exerciseId: null,
    exerciseName: '',
  });

  const [values, setValues] = useState<{
    weight: number;
    reps: number;
    isWarmUp: boolean;
  }>(null);

  const launchQuickAdd = ({
    id,
    initialValues,
    exerciseName,
  }: {
    id: number;
    initialValues: {
      weight: number;
      reps: number;
      isWarmUp: boolean;
    };
    exerciseName: string;
  }) => {
    setState({
      isOpen: true,
      exerciseId: +id,
      exerciseName,
    });
    setValues(
      initialValues || {
        weight: 0,
        reps: 0,
        isWarmUp: false,
      },
    );
  };
  const closeModal = () => {
    setState({
      isOpen: false,
      exerciseId: null,
      exerciseName: '',
    });
  };

  const submit = async (newValues) => {
    await createOrUpdateLoggedSet(null, {
      ...newValues,
      exercise: +state.exerciseId,
    });
    fireToast({ text: `${state.exerciseName} set added` });
    closeModal();
  };
  return (
    <QuickAddSetModalContext.Provider value={{ launchQuickAdd }}>
      <>
        {children}
        <Modal isOpen={state.isOpen} onRequestClose={closeModal}>
          <h1 class="capitalize">{state?.exerciseName}</h1>
          <EditableSet
            isWarmUp={!!values?.isWarmUp}
            reps={values?.reps || 0}
            weight={values?.weight || 0}
            disablePlateModal
            renderCtas={(newValues) => (
              <button class="primary w-full" onClick={() => submit(newValues)}>
                Save
              </button>
            )}
          />
        </Modal>
      </>
    </QuickAddSetModalContext.Provider>
  );
};

const useQuickSetAdd = () => useContext(QuickAddSetModalContext);

export default useQuickSetAdd;
