import get from 'lodash.get';
import { objectStores } from './config.ts';
import { openObjectStoreTransaction } from './utils/dbUtils.ts';

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
