import { h } from 'preact';
import { Link } from 'preact-router';
import { useState } from 'preact/hooks';
import Icon from '../icon/Icon';
import { routes } from '../../config/routes';
import { objectStores } from '../../context/db/config';
import useDB from '../../context/db/db';
import Modal from '../modal/Modal';
import { Routine } from '../../context/db/types';
import useOnMount from '../../hooks/useOnMount';

const RoutineList = ({ navigateToEdit }) => {
  const { deleteEntry, duplicateRoutine, getRoutines } = useDB();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [markedRoutineId, setMarkedRoutineId] = useState<number | null>(null);

  const deleteRoutine = (id) =>
    deleteEntry(objectStores.routines, id).then(() => getRoutineList());

  const getRoutineList = () => {
    getRoutines().then((res) => {
      setRoutines(res);
    });
  };

  useOnMount(getRoutineList);

  const handleDuplicate = async (id) => {
    try {
      const res = await duplicateRoutine(id);
      await getRoutineList();
      navigateToEdit({
        ...(res.data || {}),
        id: +res.id,
      });
    } catch (err) {
      alert(err.message || 'oops');
    }
  };
  return (
    <div class="px-2">
      <div class="flex items-center justify-between">
        <h1>Routines</h1>
        <Link href={`${routes.routinesBase}/new`} class="">
          + New
        </Link>
      </div>

      <div class="pt-4">
        {routines?.length
          ? routines.map((routine) => (
              <div
                key={routine.id}
                class="flex items-center justify-between bg-1 border rounded-md p-4 mb-2"
              >
                <Link
                  class="block capitalize flex-1"
                  href={`${routes.routinesBase}/${routine.id}`}
                >
                  {routine.name || 'ROUTINE'}
                </Link>
                <div class="flex items-center gap-2">
                  <button onClick={() => navigateToEdit(routine)}>
                    <Icon name="create-outline" />
                  </button>
                  <button onClick={() => handleDuplicate(+routine.id)}>
                    <Icon name="copy-outline" />
                  </button>
                  <button onClick={() => setMarkedRoutineId(+routine.id)}>
                    <Icon name="trash-outline" />
                  </button>
                </div>
              </div>
            ))
          : null}
      </div>
      <Modal
        isOpen={!!markedRoutineId}
        onRequestClose={() => setMarkedRoutineId(null)}
      >
        <div>
          <h1>Are you sure?</h1>
          <p>Delete this routine?</p>
          <div class="flex flex-wrap gap-4 pt-4">
            <button
              class="warning flex-1"
              onClick={() => {
                void deleteRoutine(markedRoutineId);
                setMarkedRoutineId(null);
              }}
            >
              Yes, delete it
            </button>
            <button
              class="btn secondary flex-1"
              onClick={() => setMarkedRoutineId(null)}
            >
              No, keep it.
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RoutineList;
