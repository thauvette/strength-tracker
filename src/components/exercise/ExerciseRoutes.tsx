import Router, { Route, route } from 'preact-router';
import useSessionContext from '../../context/sessionData/sessionData';
import useExerciseHistory from '../../hooks/useExerciseHistory/useExerciseHistory';
import LoadingSpinner from '../LoadingSpinner';
import Track from './Track';
import { routes } from '../../config/routes';
import { Exercise } from '../../context/db/types';
import ExerciseStats from '../exerciseStats/ExerciseStats';
import EditExercise from './EditExercise';
import PlannedSets from '../PlannedSets';
import Sync from './Sync';
import useOnMount from '../../hooks/useOnMount';
import { SimpleSet } from '../../types/types';

interface Props {
  id: number;
  exercise: Exercise;
  getExerciseDeatils: () => void;
}
const ExerciseRoutes = ({ id, exercise, getExerciseDeatils }: Props) => {
  const { exerciseHistory, getData, savedSet, setSavedSet, isLoading } =
    useExerciseHistory(id);
  const { updatePlanedSets, getPlannedSets, addToRoutine } =
    useSessionContext();

  const plannedSets = getPlannedSets(+id);

  const onMount = () => {
    if (plannedSets) {
      route(`/exercise/${id}/planned`);
    }
  };
  useOnMount(onMount);

  const handleUpdatePlanedSet = (sets) => {
    updatePlanedSets({
      id,
      sets: sets?.map((set) => ({
        ...set,
        exerciseName: exercise?.name,
        barWeight: exercise?.barWeight,
      })),
    });
  };

  const handleAddToDay = (sets: SimpleSet[]) => {
    addToRoutine(
      sets.map((set) => ({
        ...set,
        exerciseName: exercise?.name,
        barWeight: exercise?.barWeight,
        exercise: id,
      })),
    );
  };

  if (isLoading) {
    return (
      <div class="flex justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <Router>
      <Route
        path={`${routes.exerciseBase}/:id`}
        component={Track}
        todaysHistory={exerciseHistory?.todaysHistory}
        exerciseId={id}
        onAddSet={getData}
        exerciseName={exercise?.name}
        savedSet={savedSet}
        setSavedSet={setSavedSet}
        barWeight={exercise?.barWeight || 45}
      />
      <Route
        path={`${routes.exerciseBase}/:id/history`}
        component={ExerciseStats}
        exerciseHistory={exerciseHistory}
        onChangeSet={getData}
        updatePlanedSet={(sets) => {
          handleUpdatePlanedSet(sets);
          route(`/exercise/${id}/planned`);
          if (typeof window !== 'undefined') {
            window.scrollTo(0, 0);
          }
        }}
      />
      <Route
        path={`${routes.exerciseBase}/:id/edit`}
        component={EditExercise}
        exercise={exercise}
        onEdit={() => {
          getExerciseDeatils();
          void getData();
        }}
        id={+id}
      />
      <Route
        path={`${routes.exerciseBase}/:id/planned`}
        component={PlannedSets}
        lastHeavySet={exerciseHistory?.lastWorkout?.heaviestSet}
        onChangeCompleteSet={(set) => {
          setSavedSet(set);
          void getData();
        }}
        plannedSet={plannedSets}
        updatePlanedSet={({ sets }) => {
          handleUpdatePlanedSet(sets);
        }}
        addToToday={(newSets) => {
          handleAddToDay(newSets);
        }}
      />
      <Route
        path={`${routes.exerciseBase}/:id/sync`}
        component={Sync}
        data={exerciseHistory?.raw || []}
        name={exercise?.name || ''}
      />
    </Router>
  );
};

export default ExerciseRoutes;
