import { h } from 'preact';
import { Router, Route, route, Link } from 'preact-router';
import { useCallback, useEffect, useState } from 'preact/hooks';
import { routes } from '../../config/routes';
import AddExerciseForm from './AddExerciseForm';
import CreateRouteDaySets from './CreateRoutineDaySets';
import { RoutineDay } from '../../context/db/types';
import { RoutineSet } from '../../types/types';

interface Props {
  dayId: string;
  days: RoutineDay[];
  updateDay: (dayId: string, sets: RoutineSet[]) => void;
}

const CreateRouteDay = ({ dayId, days, updateDay }: Props) => {
  const day = days.find(({ id }) => id === dayId);
  const [sets, setSets] = useState<RoutineSet[]>(day?.sets || []);

  useEffect(() => {
    if (!day) {
      route(routes.routinesNew);
    }
  }, [day]);
  const handleSave = () => {
    updateDay(dayId, sets);
  };

  const handleAddSets = useCallback(
    (newSets: RoutineSet[]) => {
      setSets((current) => [...current, ...newSets]);
      route(`${routes.routinesNew}/${dayId}/`);
    },
    [dayId],
  );

  return (
    <div class="px-2">
      <div class="flex items-center mb-4 gap-2">
        <h1 class="">{day?.name}</h1>
        <Link
          class="underline ml-auto"
          href={`${routes.routinesNew}/${dayId}/add`}
        >
          + Exercise
        </Link>
      </div>
      <Router>
        <Route
          component={CreateRouteDaySets}
          path={`${routes.routinesNew}/${dayId}/`}
          sets={sets}
          setSets={setSets}
          handleSave={handleSave}
        />
        <Route
          path={`${`${routes.routinesNew}/:dayId/add`}`}
          component={AddExerciseForm}
          submit={handleAddSets}
          addFromHistory={handleAddSets}
        />
      </Router>
    </div>
  );
};
export default CreateRouteDay;
