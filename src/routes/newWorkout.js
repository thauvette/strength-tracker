import { h } from 'preact';
import { Link, route } from 'preact-router';
import { uniqBy } from 'lodash';
import ExerciseSearch from '../components/exerciseSelection/ExerciseSearch';
import { routes } from '../config/routes';
import { useEffect, useState } from 'preact/hooks';
import useDB from '../context/db/db.tsx';

const NewWorkout = () => {
  const [todaysSets, setTodaysSets] = useState(null);
  const todaysExercises = uniqBy(todaysSets || [], 'exercise');
  const { getTodaySets } = useDB();
  useEffect(() => {
    getTodaySets().then((res) => setTodaysSets(res));
  }, []); // eslint-disable-line

  const handleSelectExercise = (exercise) =>
    route(`${routes.exerciseBase}/${exercise.id}`);

  return (
    <div>
      {todaysExercises?.length ? (
        <div>
          <p>Quick links</p>
          {todaysExercises.map((exercise) => (
            <Link
              key={exercise.exercise}
              class="block text-lg capitalize underline my-4"
              href={`/exercise/${exercise?.exercise}`}
            >
              {exercise.exerciseData?.name}
            </Link>
          ))}
        </div>
      ) : null}
      <div class="h-full flex flex-col">
        <ExerciseSearch handleSelectExercise={handleSelectExercise} />
      </div>
    </div>
  );
};

export default NewWorkout;
