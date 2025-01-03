import { set } from 'lodash';
import { objectStores } from './config.ts';
import { openObjectStoreTransaction } from './utils/dbUtils.ts';

export const getWendlerExercises = (db) =>
  new Promise((resolve) => {
    const { objectStore: store } = openObjectStoreTransaction(
      db,
      objectStores.exercises,
    );
    const keyRangeValue = IDBKeyRange.bound(1, 4);
    const results = [];
    store.openCursor(keyRangeValue).onsuccess = (e) => {
      const cursor = e.target.result;
      if (cursor) {
        results.push({
          ...cursor.value,
          primaryId: cursor.primaryKey,
        });
        cursor.continue();
      } else {
        resolve(results);
      }
    };
  });

export const updateWendlerItem = (db, { id, path, value }) =>
  new Promise((resolve, reject) => {
    // get the current item.
    const { objectStore } = openObjectStoreTransaction(
      db,
      objectStores.wendlerCycles,
    );
    const request = objectStore.get(+id);

    request.onerror = (err) => reject(err.message || 'unable to find data');

    request.onsuccess = () => {
      if (!request.result) {
        reject(new Error('unable to find entry'));
      }

      const currentEntry = { ...request.result };

      set(currentEntry, path, value);

      // Put this updated object back into the database.
      const requestUpdate = objectStore.put(currentEntry, +id);

      requestUpdate.onerror = (err) =>
        reject(err.message || 'unable to update entry');

      // Success - the data is updated!
      requestUpdate.onsuccess = () => resolve(currentEntry);
    };
  });

export const createCycle = (db, data) =>
  new Promise((resolve, reject) => {
    if (!db) {
      return;
    }
    const { objectStore, transaction } = openObjectStoreTransaction(
      db,
      objectStores.wendlerCycles,
    );

    transaction.oncomplete = function () {
      resolve({ success: true });
    };

    transaction.onerror = function (event) {
      // todo: Don't forget to handle errors!
      console.warn(event, 'oops');
      reject();
    };

    if (data.id) {
      objectStore.put({ ...data, updated: new Date().getTime() }, +data.id);
    } else {
      objectStore.add({ ...data, created: new Date().getTime() });
    }
  });

export const getWendlerCycle = (db, id) =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(
      db,
      objectStores.wendlerCycles,
    );
    const request = objectStore.get(+id);
    request.onerror = function (err) {
      console.warn('Err', err);
      reject(err.message || 'unable to find item');
    };
    request.onsuccess = (event) => resolve(event.target.result);
  });
