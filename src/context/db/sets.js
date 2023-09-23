import dayjs from 'dayjs';
import { objectStores } from './config.ts';
import { getFromCursor, openObjectStoreTransaction } from './utils/dbUtils.ts';

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

export const createOrUpdateLoggedSet = (db, id, data) =>
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
        const result = {
          ...data,
          exercise: +data.exercise,
          created: new Date().getTime(),
          id: event?.target?.result,
        };
        fireSetAddedEvent(result);
        return resolve(result);
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
        requestUpdate.onerror = (err) =>
          reject(err?.message || 'unable to update entry');

        // Success - the data is updated!
        requestUpdate.onsuccess = (e) => {
          const result = { ...newValue, id: e?.target?.result };
          fireSetAddedEvent(result);
          return resolve(result);
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
    deleteRequest.onerror = (err) =>
      reject(err?.message || 'unable to delete item');
  });

export const getAllSetsHistory = (db) =>
  new Promise((resolve) => {
    return Promise.all([
      getFromCursor(db, objectStores.exercises),
      getFromCursor(db, objectStores.sets),
      getFromCursor(db, objectStores.muscleGroups),
    ]).then(([exercises, entries, muscleGroups]) => {
      const results = Object.values(entries || {})?.reduce((obj, entryRaw) => {
        if (!entryRaw.created || !entryRaw.exercise) {
          return obj;
        }
        const entry = formatSet(entryRaw);
        const dateKey = entry.created
          ? dayjs(entry.created).format('YYYY-MM-DD')
          : 'lost';

        const exercise = exercises[entry.exercise];
        const currentItems = obj[dateKey] || [];
        currentItems.push({
          ...exercise,
          ...entry,
          primaryGroupName: muscleGroups?.[exercise?.primaryGroup]?.name,
        });
        return {
          ...obj,
          [dateKey]: currentItems,
        };
      }, {});
      resolve(results);
    });
  });

export const getSetsByDateRange = (db, startDate, endDate) => {
  const getSets = new Promise((resolve) => {
    const start = dayjs(startDate).startOf('day').toDate().getTime();
    const end = dayjs(endDate).endOf('day').toDate().getTime();
    const range = IDBKeyRange.bound(start, end);
    const { objectStore, transaction } = openObjectStoreTransaction(
      db,
      objectStores.sets,
    );
    const index = objectStore.index('created');
    const results = [];
    index.openCursor(range).onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        results.push(formatSet(cursor.value));
        cursor.continue();
      }
    };
    transaction.oncomplete = () => resolve(results);
  });
  return Promise.all([
    getSets,
    getFromCursor(db, objectStores.exercises).catch((err) => console.log(err)),
  ]).then(([sets, exercises]) => {
    const result = sets.map((set) => {
      const exercise = exercises?.[set?.exercise];

      return {
        ...set,
        exerciseData: exercise,
      };
    });
    return result;
  });
};

export const getSetsByDay = (db, day) => {
  return getSetsByDateRange(db, day, day);
};
