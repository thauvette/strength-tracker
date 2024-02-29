import { h } from 'preact';
import { route } from 'preact-router';
import { useEffect, useState } from 'preact/hooks';
import Accordion from '../accordion/accordion';
import { routes } from '../../config/routes';
import useDB from '../../context/db/db';
import useSessionContext from '../../context/sessionData/sessionData';
import Body from '../async/body';

const Routine = ({ id }) => {
  const [routine, setRoutine] = useState(null);
  const [error, setError] = useState(null);
  const [analysisDay, setAnalysisDay] = useState('all');

  const { getRoutine: getDbRoutine } = useDB();
  const { startRoutine } = useSessionContext();

  const getRoutine = () => {
    getDbRoutine(+id)
      .then((res) => {
        setRoutine(res);
      })
      .catch((err) => setError(err));
  };

  useEffect(() => {
    getRoutine();
  }, []); // eslint-disable-line

  const musclesWorked =
    analysisDay === 'all'
      ? routine?.days?.reduce(
          (obj, { sets }) => {
            const musclesWorks = sets
              .map((set) => set.musclesWorked || [])
              .flat();

            const secondary = sets
              .map((set) => set.secondaryMusclesWorked || [])
              .flat();

            return {
              activePrimary: Array.from(
                new Set([...obj.activePrimary, ...musclesWorks]),
              ),
              activeSecondary: Array.from(
                new Set([...obj.activeSecondary, ...secondary]),
              ),
            };
          },
          {
            activePrimary: [],
            activeSecondary: [],
          },
        )
      : routine.days?.[analysisDay]?.sets?.reduce(
          (obj, set) => {
            return {
              activePrimary: Array.from(
                new Set([...obj.activePrimary, ...(set.musclesWorked || [])]),
              ),
              activeSecondary: Array.from(
                new Set([
                  ...obj.activeSecondary,
                  ...(set.secondaryMusclesWorked || []),
                ]),
              ),
            };
          },
          {
            activePrimary: [],
            activeSecondary: [],
          },
        );

  const setActiveRoutine = (sets, dayId) => {
    startRoutine(
      sets.map((set) => ({
        ...set,
        id: null,
        routineSetId: set.routineSetId || set.id, // legacy routines have set.id but shouldn't
        routineId: +id,
        dayId,
      })),
    );
    route(routes.activeRoutine);
  };

  if (!routine && !error) {
    return null;
  }
  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div class="px-2">
      <h1 class="capitalize mb-4">{routine.name}</h1>
      {routine.days?.length ? (
        <div>
          {routine.days.map((day, i) => (
            <div key={i} class="bg-1 border rounded-md mb-4">
              <Accordion title={day.name} titleClass="font-bold">
                <div class="px-4 pt-2 pb-4">
                  {day.sets?.length
                    ? day.sets.map((set, setIndex) => (
                        <p key={setIndex}>
                          {set.exerciseName} - {set.reps} @ {set.weight}
                          {set.isWarmUp && (
                            <span class="text-xs"> (warm up)</span>
                          )}
                        </p>
                      ))
                    : null}
                  <button
                    class="bg-primary-900 text-white mt-8"
                    onClick={() => setActiveRoutine(day.sets, day.id)}
                  >
                    Start Workout
                  </button>
                </div>
              </Accordion>
            </div>
          ))}
          <div>
            <p>Analysis</p>
            <select
              value={analysisDay}
              class="w-full"
              onInput={(event) => {
                if (event.target instanceof HTMLSelectElement) {
                  setAnalysisDay(event.target.value);
                }
              }}
            >
              <option value="all">All days</option>

              {routine?.days.map((day, index) => (
                <option key={index} value={index}>
                  {day.name}
                </option>
              ))}
            </select>
            <div class="pt-8 max-w-[15rem] mx-auto">
              <Body {...musclesWorked} />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Routine;
