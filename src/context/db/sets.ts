import dayjs from 'dayjs';
import { pick } from 'lodash';
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

const fireSetsChangeEvent = (
  name: string,
  set: DbStoredSet | { id: number },
) => {
  const customEvent = new CustomEvent(name, {
    detail: set,
  });
  dispatchEvent(customEvent);
};
export const fireSetRemovedEvent = (set: { id: number }) => {
  fireSetsChangeEvent('dbSetRemoved', set);
};

const fireSetAddedEvent = (set: DbStoredSet) => {
  fireSetsChangeEvent('dbSetAdded', set);
};

const allowedFields = [
  'created',
  'exercise',
  'isWarmUp',
  'note',
  'reps',
  'updated',
  'weight',
];

const formatSet = (set: Partial<DbStoredSet>) => {
  const isWarmUp =
    typeof set.isWarmUp === 'string' ? set.isWarmUp === 'true' : !!set.isWarmUp;
  return pick(
    {
      ...set,
      isWarmUp,
    },
    allowedFields,
  );
};

const fillSet = (
  set: Partial<DbStoredSet & { id?: number | null }>,
): DbStoredSet & { id: number | null } => ({
  created: set.created,
  exercise: set.exercise,
  isWarmUp: !!set.isWarmUp,
  note: set.note ?? '',
  reps: set.reps ?? 0,
  updated: set.updated,
  weight: set.weight ?? 0,
  id: set.id ?? null,
});

export const createOrUpdateLoggedSet = async (
  db: IDBDatabase,
  id: number,
  data: Partial<Set>,
): Promise<DbStoredSet> =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(db, objectStores.sets);
    if (!id) {
      const created = new Date().getTime();
      const reqBody = formatSet({
        ...data,
        reps: data.reps,
        weight: data.weight,
        exercise: data.exercise,
        isWarmUp: !!data.isWarmUp,
        note: data.note ?? '',
        created,
      });
      const addRequest = objectStore.add(reqBody);
      addRequest.onerror = (e) => console.warn(e);
      addRequest.onsuccess = (event) => {
        if (event.target instanceof IDBRequest) {
          const result = {
            ...reqBody,
            id: event?.target?.result,
          };
          fireSetAddedEvent(fillSet(result));
          return resolve(fillSet(result));
        }
      };
    } else {
      const request = objectStore.get(+id);
      request.onsuccess = () => {
        if (!request.result) {
          reject(new Error('unable to find entry'));
        }
        const newValue = formatSet({
          ...request.result,
          ...data,
          updated: new Date().getTime(),
        });
        const requestUpdate = objectStore.put(newValue, +id);
        requestUpdate.onerror = () => reject('unable to update entry');

        // Success - the data is updated!
        requestUpdate.onsuccess = (e) => {
          if (e.target instanceof IDBRequest) {
            const result = { ...newValue, id: e?.target?.result };
            fireSetAddedEvent(fillSet(result));
            return resolve(fillSet(result));
          }
        };
      };
    }
  });

export const deleteLoggedSet = (
  db: IDBDatabase,
  id: number,
): Promise<boolean> =>
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

export const getDataAndAugmentSet = (db: IDBDatabase, set: DbStoredSet) =>
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
          results.push(cursor.value);
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
