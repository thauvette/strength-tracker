import { h } from 'preact';
import Router, { route } from 'preact-router';
import { useState } from 'preact/hooks';
import { routes } from '../config/routes';
import ActiveRoutine from '../components/routines/ActiveRoutine';
import CreateRoutine from '../components/routines/CreateRoutine';
import Routine from '../components/routines/Routine';
import RoutineList from '../components/routines/RoutineList';

const Routines = () => {
  const [editRoutineValues, setEditRoutineValues] = useState(null);

  const navigateToEdit = (routine) => {
    setEditRoutineValues(routine);
    route(routes.routinesNew);
  };
  return (
    <Router>
      <CreateRoutine
        path={routes.routinesNew}
        initialValues={editRoutineValues}
      />
      <RoutineList path={routes.routinesBase} navigateToEdit={navigateToEdit} />
      <Routine path={`${routes.routinesBase}/:id`} />
      <ActiveRoutine path={routes.activeRoutine} />
    </Router>
  );
};

export default Routines;
