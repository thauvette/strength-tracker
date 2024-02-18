import { h } from 'preact';
import Router, { route } from 'preact-router';
import { useState } from 'preact/hooks';
import { routes } from '../config/routes';
import ActiveRoutine from '../components/routines/ActiveRoutine';
import CreateRoutine from '../components/routines/CreateRoutine';
import Routine from '../components/routines/Routine.tsx';
import RoutineList from '../components/routines/RoutineList';

const Routines = () => {
  const [editRoutineValues, setEditRoutineValues] = useState(null);

  const navigateToEdit = (routine) => {
    setEditRoutineValues({
      ...routine,
      days: routine.days.map((day) => ({
        ...day,
        sets: day.sets.map((set) => ({
          ...set,
          id: set.routineSetId,
        })),
      })),
    });
    route(routes.routinesNew);
  };
  return (
    <Router>
      <CreateRoutine
        path={`${routes.routinesNew}/:remaining_path*`}
        initialValues={editRoutineValues}
      />
      <RoutineList path={routes.routinesBase} navigateToEdit={navigateToEdit} />
      <Routine path={`${routes.routinesBase}/:id`} />
      <ActiveRoutine path={routes.activeRoutine} />
    </Router>
  );
};

export default Routines;
