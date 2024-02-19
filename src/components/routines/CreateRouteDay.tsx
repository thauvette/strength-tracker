import { h } from 'preact';
import { Router, Route, route, Link } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import { routes } from '../../config/routes';
import AddExerciseForm from './AddExerciseForm';
import generateRandomId from '../../utilities.js/generateRandomId';
import { Set } from '../EditableSetList';
import CreateRouteDaySets from './CreateRoutineDaySets';

interface Props {
  dayId: string;
  days: {
    name: string;
    id: string;
    sets: Set[];
  }[];
  updateDay: (dayId: string, sets: Set[]) => void;
}

const CreateRouteDay = ({ dayId, days, updateDay }: Props) => {
  const day = days.find(({ id }) => id === dayId);
  const [sets, setSets] = useState(day?.sets || []);

  useEffect(() => {
    if (!day) {
      route(routes.routinesNew);
    }
  }, [day]);
  const handleSave = () => {
    updateDay(dayId, sets);
  };

  const handleAddSets = (newSets) => {
    setSets([
      ...sets,
      ...newSets.map((set) => ({
        ...set,
        id: set.id || generateRandomId(),
        musclesWorked: set?.musclesWorked?.map(({ id }) => +id) || [],
        secondaryMusclesWorked:
          set?.secondaryMusclesWorked?.map(({ id }) => +id) || [],
      })),
    ]);
    route(`${routes.routinesNew}/${dayId}/`);
  };

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
          addFromHistroy={handleAddSets}
        />
      </Router>
    </div>
  );
};
export default CreateRouteDay;
