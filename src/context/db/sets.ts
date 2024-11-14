import dayjs from 'dayjs';
import { objectStores } from './config';
import { getFromCursor, openObjectStoreTransaction } from './utils/dbUtils';
import {
  AugmentedDataSet,
  DbStoredSet,
  Exercise,
  Set,
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
  data: Set,
): Promise<Set> =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(db, objectStores.sets);

    const reqBody = {
      exercise: +data.exercise,
      isWarmUp: !!data.isWarmUp,
      reps: data.reps,
      weight: data.weight,
    };

    if (!id) {
      const addRequest = objectStore.add({
        ...reqBody,
        created: new Date().getTime(),
      });
      addRequest.onerror = (e) => console.warn(e);
      addRequest.onsuccess = (event) => {
        if (event.target instanceof IDBRequest) {
          const result = {
            ...reqBody,
            id: event?.target?.result,
          };
          fireSetAddedEvent(result);
          return resolve(result);
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
          ...reqBody,
          updated: new Date().getTime(),
        };
        const requestUpdate = objectStore.put(newValue, +id);
        requestUpdate.onerror = () => reject('unable to update entry');

        // Success - the data is updated!
        requestUpdate.onsuccess = (e) => {
          if (e.target instanceof IDBRequest) {
            const result = { ...newValue, id: e?.target?.result };
            fireSetAddedEvent(result);
            return resolve(result);
          }
        };
      };
    }
  });

export const deleteLoggedSet = (db, id): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(db, objectStores.sets);
    const deleteRequest = objectStore.delete(id);
    deleteRequest.onsuccess = () => {
      fireSetRemovedEvent({ id });
      return resolve(true);
    };
    deleteRequest.onerror = () => {
      return reject('unable to delete item');
    };
  });

// const getDataAndAugmentSet = (db: IDBDatabase, set: DbStoredSet) =>
//   Promise.all([
//     getFromCursor(db, objectStores.exercises).catch((err) =>
//       console.warn(err),
//     ) as Promise<{ [key: string]: Exercise }>,
//     getFromCursor(db, objectStores.muscleGroups).catch((err) =>
//       console.warn(err),
//     ) as Promise<{ [key: string]: MuscleGroup }>,
//   ]).then(([exercises, muscleGroups]) =>
//     augmentSetData(set, exercises, muscleGroups),
//   );

const augmentSetData = (
  set: DbStoredSet,
  exercises: { [key: string]: Exercise },
  muscleGroups: { [key: string]: MuscleGroup },
): AugmentedDataSet => {
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

export const getSetsByDateRange = async (
  db: IDBDatabase,
  startDate: Date,
  endDate: Date,
): Promise<AugmentedDataSet[]> => {
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
  try {
    const [sets, exercises, muscleGroups] = await Promise.all([
      getSets,
      getFromCursor(db, objectStores.exercises).catch((err) =>
        console.warn(err),
      ) as Promise<{ [key: string]: Exercise }>,
      getFromCursor(db, objectStores.muscleGroups).catch((err) =>
        console.warn(err),
      ) as Promise<{ [key: string]: MuscleGroup }>,
    ]);
    return sets.map((set) => augmentSetData(set, exercises, muscleGroups));
  } catch (err) {
    console.warn(err);
  }
};
