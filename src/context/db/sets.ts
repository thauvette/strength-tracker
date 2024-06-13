import dayjs from 'dayjs';
import { objectStores } from './config';
import { getFromCursor, openObjectStoreTransaction } from './utils/dbUtils';
import {
  Exercise,
  HydratedSet,
  LogsSet,
  MuscleGroup,
  SetType,
} from './types.js';

const fireSetsChangeEvent = (name, set) => {
  const customEvent = new CustomEvent(name, {
    detail: set,
  });
  dispatchEvent(customEvent);
};
export const fireSetRemovedEvent = (set) => {
  fireSetsChangeEvent('dbSetRemoved', set);
};

const fireSetAddedEvent = (set) => {
  fireSetsChangeEvent('dbSetAdded', set);
};

const formatSet = (set) => {
  const isWarmUp =
    typeof set.isWarmUp === 'string' ? set.isWarmUp === 'true' : !!set.isWarmUp;
  return {
    ...set,
    isWarmUp,
  };
};

export const createOrUpdateLoggedSet = (
  db: IDBDatabase,
  id: number,
  data: {
    exercise: number;
    reps: number;
    weight: number;
    isWarmUp?: boolean;
    notes?: string;
  },
): Promise<HydratedSet> =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(db, objectStores.sets);
    if (!id) {
      const addRequest = objectStore.add({
        ...data,
        exercise: +data.exercise,
        created: new Date().getTime(),
      });
      addRequest.onerror = (e) => console.warn(e);
      addRequest.onsuccess = (event) => {
        if (event.target instanceof IDBRequest) {
          const result = {
            ...data,
            exercise: +data.exercise,
            created: new Date().getTime(),
            id: event?.target?.result,
          };
          return getDataAndAugmentSet(db, result).then((res) => {
            fireSetAddedEvent(res);
            return resolve(res);
          });
        }
      };
    } else {
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
            const result = { ...newValue, id: e?.target?.result };
            return getDataAndAugmentSet(db, result).then((res) => {
              fireSetAddedEvent(res);
              return resolve(res);
            });
          }
        };
      };
    }
  });

export const deleteLoggedSet = (db, id) =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(db, objectStores.sets);
    const deleteRequest = objectStore.delete(id);
    deleteRequest.onsuccess = () => {
      fireSetRemovedEvent({ id });
      return resolve(true);
    };
    deleteRequest.onerror = () => reject('unable to delete item');
  });

const getDataAndAugmentSet = (db, set) =>
  Promise.all([
    getFromCursor(db, objectStores.exercises).catch((err) =>
      console.warn(err),
    ) as Promise<{ [key: string]: Exercise }>,
    getFromCursor(db, objectStores.muscleGroups).catch((err) =>
      console.warn(err),
    ) as Promise<{ [key: string]: MuscleGroup }>,
  ]).then(([exercises, muscleGroups]) =>
    augmentSetData(set, exercises, muscleGroups),
  );

const augmentSetData = (
  set: SetType,
  exercises: { [key: string]: Exercise },
  muscleGroups: { [key: string]: MuscleGroup },
) => {
  const exercise = exercises?.[set?.exercise];
  const primaryMuscles = exercise?.musclesWorked?.map(
    (id) => muscleGroups?.[id],
  );
  const secondaryMuscles = exercise?.secondaryMusclesWorked?.map(
    (id) => muscleGroups?.[id],
  );
  const primaryMuscleGroup = muscleGroups?.[exercise?.primaryGroup];
  return {
    ...set,
    exerciseData: exercise,
    primaryMuscles,
    secondaryMuscles,
    primaryMuscleGroup,
    name: exercise?.name || '',
    musclesWorked: exercise?.musclesWorked || [],
    barWeight: exercise?.barWeight || 45,
    secondaryMusclesWorked: exercise?.secondaryMusclesWorked || [],
    primaryGroup: exercise?.primaryGroup,
    type: exercise?.type || 'wr',
  };
};

export const getSetsByDateRange = (
  db: IDBDatabase,
  startDate: Date,
  endDate: Date,
): Promise<LogsSet[]> => {
  const getSets: Promise<SetType[]> = new Promise((resolve) => {
    const start = dayjs(startDate).startOf('day').toDate().getTime();
    const end = dayjs(endDate).endOf('day').toDate().getTime();
    const range = IDBKeyRange.bound(start, end);
    const { objectStore, transaction } = openObjectStoreTransaction(
      db,
      objectStores.sets,
    );
    const index = objectStore.index('created');
    const results: SetType[] = [];
    index.openCursor(range).onsuccess = (event) => {
      if (event.target instanceof IDBRequest) {
        const cursor = event.target.result;
        if (cursor) {
          results.push(formatSet(cursor.value));
          cursor.continue();
        }
      }
    };
    transaction.oncomplete = () => resolve(results);
  });
  return Promise.all([
    getSets,
    getFromCursor(db, objectStores.exercises).catch((err) =>
      console.warn(err),
    ) as Promise<{ [key: string]: Exercise }>,
    getFromCursor(db, objectStores.muscleGroups).catch((err) =>
      console.warn(err),
    ) as Promise<{ [key: string]: MuscleGroup }>,
  ]).then(([sets, exercises, muscleGroups]) => {
    const result = sets.map((set) =>
      augmentSetData(set, exercises, muscleGroups),
    );
    return result;
  });
};

export const getSetsByDay = (db, day) => {
  return getSetsByDateRange(db, day, day);
};
