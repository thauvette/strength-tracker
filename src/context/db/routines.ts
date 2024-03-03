import get from 'lodash.get';
import { objectStores } from './config';
import {
  getFromCursor,
  getItem,
  openObjectStoreTransaction,
} from './utils/dbUtils';
import { getExerciseById } from './exercises';
import { Exercise, Routine } from './types.js';

export const createRoutine = (
  db: IDBDatabase,
  data: Routine,
): Promise<{ data: Routine; id: number }> =>
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
      requestUpdate.onerror = () => reject('unable to update entry');

      // Success - the data is updated!
      requestUpdate.onsuccess = (e) => {
        if (e.target instanceof IDBRequest) {
          return resolve({ ...newValue, id: e?.target?.result });
        }
      };
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

export const duplicateRoutine = (
  db: IDBDatabase,
  id: number,
): Promise<{
  data: Routine;
  id: number;
}> =>
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

const formatRoutines = async (
  db: IDBDatabase,
  routines: { [key: number]: Routine },
) => {
  const exerciseIds: number[] = Object.values(routines || {}).reduce(
    (arr, routine) => {
      const routineExerciseIds = routine.days.reduce((routineArr, day) => {
        const dayExerciseIds = Array.from(
          new Set(day?.sets?.map(({ exercise }) => +exercise) || []),
        );

        return Array.from(new Set([...routineArr, ...dayExerciseIds]));
      }, []);

      return Array.from(new Set([...arr, ...routineExerciseIds]));
    },
    [],
  );
  const promiseList = exerciseIds.map((id) =>
    getExerciseById(db, id).then((res: Exercise) => ({
      id,
      ...(res || {}),
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

export const getRoutines = async (db: IDBDatabase) => {
  try {
    const result: { [key: number]: Routine } = await getFromCursor(
      db,
      objectStores.routines,
    );
    // get every exercise id in all routines.
    return formatRoutines(db, result);
  } catch (err) {
    throw new Error(err?.message || 'error getting routines');
  }
};

export const getRoutine = async (db: IDBDatabase, id: number) => {
  try {
    const routine = (await getItem(db, objectStores.routines, +id)) as Routine;
    const formatted = await formatRoutines(db, { [id]: routine });
    return formatted[0];
  } catch (err) {
    throw new Error(err.message);
  }
};
