import { objectStores } from '../config';
import { ObjectStoreEvent } from '../types';
import formatExercise from './formatExercise';

export const openObjectStoreTransaction = (
  db: IDBDatabase,
  store: string,
): {
  transaction: IDBTransaction;
  objectStore: IDBObjectStore;
} => {
  const transaction = db.transaction([store], 'readwrite');
  const objectStore = transaction.objectStore(store);
  return {
    transaction,
    objectStore,
  };
};

const formatData = (store: string, data: any) => {
  if (store === objectStores.exercises) {
    return formatExercise(data);
  }
  return data;
};

export const getFromCursor = (db: IDBDatabase, store: string) =>
  new Promise((resolve, reject) => {
    const { transaction, objectStore } = openObjectStoreTransaction(db, store);

    const results = {};

    objectStore.openCursor().onsuccess = (event: ObjectStoreEvent) => {
      const cursor = event.target.result;
      if (cursor) {
        results[cursor.key] = formatData(store, cursor.value);
        cursor.continue();
      }
    };
    transaction.oncomplete = () => resolve(results);

    transaction.onerror = () => {
      reject(new Error('oops'));
    };
  });

export const getItem = (db: IDBDatabase, store: string, id: number) =>
  new Promise((resolve, reject) => {
    if (!store) {
      reject('store is required');
      return;
    }
    if (!id) {
      reject('an id is required');
      return;
    }
    const { objectStore } = openObjectStoreTransaction(db, store);
    const request = objectStore.get(+id);
    request.onerror = function () {
      reject('unable to find item');
    };
    request.onsuccess = (event: ObjectStoreEvent) => {
      if (event.target.result) {
        resolve(event.target.result);
      } else {
        reject('not found');
      }
    };
  });
