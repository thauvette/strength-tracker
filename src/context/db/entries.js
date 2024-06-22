import { objectStores } from './config.ts';
import { fireSetRemovedEvent } from './sets';
import { openObjectStoreTransaction } from './utils/dbUtils.ts';

export const getAllEntriesByKey = async (db, store, key, id) =>
  new Promise((resolve) => {
    const { objectStore } = openObjectStoreTransaction(db, store);

    const index = objectStore.index(key);
    const keyRange = IDBKeyRange.only(+id);
    const cursorRequest = index.openCursor(keyRange);
    const result = [];
    cursorRequest.onsuccess = function (event) {
      const data = event?.target?.result?.value;
      if (data) {
        result.push(data);
        event?.target?.result.continue();
      } else {
        resolve(result);
      }
    };
  });

export const deleteEntry = (db, store, id) =>
  new Promise((resolve, reject) => {
    const request = db
      .transaction([store], 'readwrite')
      .objectStore(store)
      .delete(+id);
    request.onsuccess = function () {
      if (store === objectStores.sets) {
        fireSetRemovedEvent({ id });
      }
      return resolve(true);
    };
    request.onerror = function () {
      return reject('error deleting item');
    };
  });
export const updateEntry = (db, store, id, data) =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(db, store);

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
        reject(err.message || 'unable to update entry');

      // Success - the data is updated!
      requestUpdate.onsuccess = (e) =>
        resolve({ ...newValue, id: e.target.result });
    };
  });

export const createEntry = (db, store, data) =>
  new Promise((resolve, reject) => {
    const { transaction, objectStore } = openObjectStoreTransaction(db, store);
    const request = objectStore.add({
      ...data,
      created: new Date().getTime(),
    });
    request.onsuccess = (event) =>
      resolve({
        ...data,
        id: event.target.result,
        created: new Date().getTime(),
      });

    transaction.onerror = function (err) {
      // todo: Don't forget to handle errors!
      console.warn(err, 'oops');
      reject(new Error(err.message || 'unable to create item'));
    };
  });
