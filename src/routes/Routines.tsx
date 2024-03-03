import { h } from 'preact';
import Router, { Route, route } from 'preact-router';
import { useState } from 'preact/hooks';
import { routes } from '../config/routes';
import ActiveRoutine from '../components/routines/ActiveRoutine';
import CreateRoutine from '../components/routines/CreateRoutine';
import Routine from '../components/routines/Routine';
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
          id: set.routineSetId || set.id,
        })),
      })),
    });
    route(routes.routinesNew);
  };
  const scrollTop = () => {
    if (window !== undefined) {
      window.scrollTo(0, 0);
    }
  };
  return (
    <div>
      <Router onChange={scrollTop}>
        <Route
          component={CreateRoutine}
          path={`${routes.routinesNew}/:remaining_path*`}
          initialValues={editRoutineValues}
        />
        <Route
          component={RoutineList}
          path={routes.routinesBase}
          navigateToEdit={navigateToEdit}
        />
        <Route component={Routine} path={`${routes.routinesBase}/:id`} />
        <Route component={ActiveRoutine} path={routes.activeRoutine} />
      </Router>
    </div>
  );
};

export default Routines;
