import get from 'lodash.get';
import { objectStores } from './config.ts';
import {
  getFromCursor,
  getItem,
  openObjectStoreTransaction,
} from './utils/dbUtils.ts';
import { getExerciseById } from './exercises';

export const createRoutine = (db, data) =>
  new Promise((resolve) => {
    const { objectStore } = openObjectStoreTransaction(
      db,
      objectStores.routines,
    );
    const addRequest = objectStore.add({
      created: new Date().getTime(),
      ...data,
    });
    addRequest.onerror = (e) => console.warn(e);
    addRequest.onsuccess = (event) => {
      resolve({
        data,
        id: get(event, 'target.result', null),
      });
    };
  });

export const updateRoutine = (db, id, data) =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(
      db,
      objectStores.routines,
    );
    const request = objectStore.get(+id);
    request.onsuccess = () => {
      if (!request.result) {
        reject(new Error('unable to find entry'));
      }
      const newValue = {
        ...request.result,
        ...data,
        updated: new Date().getTime(),
      };
      const requestUpdate = objectStore.put(newValue, +id);
      requestUpdate.onerror = (err) =>
        reject(err?.message || 'unable to update entry');

      // Success - the data is updated!
      requestUpdate.onsuccess = (e) =>
        resolve({ ...newValue, id: e?.target?.result });
    };
  });

export const updateSingleRoutineSet = (db, id, dayId, set) =>
  new Promise((_, reject) => {
    const { objectStore } = openObjectStoreTransaction(
      db,
      objectStores.routines,
    );
    const request = objectStore.get(+id);
    request.onsuccess = () => {
      if (!request.result) {
        reject(new Error('unable to find entry'));
      }
      const current = {
        ...request.result,
        days: request.result?.days?.map((day) =>
          day.id === dayId
            ? {
                ...day,
                sets: day.sets?.map((currentSet) =>
                  currentSet.routineSetId === set.routineSetId ||
                  currentSet.id === set.routineSetId // legacy routines have id
                    ? {
                        exercise: set.exercise,
                        exerciseName: set.exerciseName,
                        reps: set.reps,
                        routineSetId: set.routineSetId,
                        weight: set.weight,
                        isWarmUp: !!set.isWarmUp,
                      }
                    : currentSet,
                ),
              }
            : day,
        ),
      };
      return updateRoutine(db, id, current);
    };
  });

export const duplicateRoutine = (db, id) =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(
      db,
      objectStores.routines,
    );
    const request = objectStore.get(+id);
    request.onsuccess = () => {
      if (!request.result) {
        return reject(new Error('unable to find entry'));
      }
      return resolve(
        createRoutine(db, {
          ...request.result,
          name: `${request.result?.name || ''} - copy`,
          created: new Date().getTime(),
        }),
      );
    };
  });

const formatRoutines = async (db, routines) => {
  const exerciseIds = Object.values(routines || {}).reduce((arr, routine) => {
    const routineExerciseIds = routine.days.reduce((routineArr, day) => {
      const dayExerciseIds = Array.from(
        new Set(day?.sets?.map(({ exercise }) => +exercise) || []),
      );

      return Array.from(new Set([...routineArr, ...dayExerciseIds]));
    }, []);

    return Array.from(new Set([...arr, ...routineExerciseIds]));
  }, []);
  const promiseList = exerciseIds.map((id) =>
    getExerciseById(db, id).then((res) => ({
      id,
      ...res,
    })),
  );

  return Promise.all(promiseList).then((responses) =>
    Object.entries(routines).map(([id, routine]) => ({
      ...routine,
      id: +id,
      days:
        routine.days?.map((day) => ({
          ...day,
          sets:
            day?.sets?.map((set) => {
              const exerciseData = responses.find(
                ({ id }) => +id === +set.exercise,
              );
              return {
                ...set,
                musclesWorked: exerciseData?.musclesWorked || [],
                secondaryMusclesWorked:
                  exerciseData?.secondaryMusclesWorked || [],
              };
            }) || [],
        })) || [],
    })),
  );
};

export const getRoutines = async (db) => {
  try {
    const result = await getFromCursor(db, objectStores.routines);
    // get every exercise id in all routines.
    return formatRoutines(db, result);
  } catch (err) {
    throw new Error(err?.message || 'error getting routines');
  }
};

export const getRoutine = async (db, id) => {
  try {
    const routine = await getItem(db, objectStores.routines, +id);
    const formatted = await formatRoutines(db, { [id]: routine });
    return formatted[0];
  } catch (err) {
    throw new Error(err.message);
  }
};
