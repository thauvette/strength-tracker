import { objectStores } from './../config';
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

export function getFromCursor<Type>(
  db: IDBDatabase,
  store: string,
): Promise<{ [key: string]: Type }> {
  return new Promise((resolve, reject) => {
    const { transaction, objectStore } = openObjectStoreTransaction(db, store);
    const results = {};
    objectStore.openCursor().onsuccess = (event: ObjectStoreEvent) => {
      const cursor = event.target.result;
      if (cursor) {
        results[cursor.key] =
          store === objectStores.exercises
            ? formatExercise({
                ...cursor.value,
                id: +cursor.key,
              })
            : {
                ...cursor.value,
                id: +cursor.key,
              };
        cursor.continue();
      }
    };
    transaction.oncomplete = () => resolve(results);

    transaction.onerror = () => {
      reject(new Error('oops'));
    };
  });
}

export const getItem = <Type>(
  db: IDBDatabase,
  store: string,
  id: number,
): Promise<Type> =>
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
        resolve({
          ...event.target.result,
          id,
        });
      } else {
        reject('not found');
      }
    };
  });
