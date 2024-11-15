import { objectStores } from './config';
import { fireSetRemovedEvent } from './sets';
import { openObjectStoreTransaction } from './utils/dbUtils';

export const getAllEntriesByKey = async <Type>(
  db: IDBDatabase,
  store: string,
  key: string,
  id: number,
): Promise<Type[]> =>
  new Promise((resolve) => {
    const { objectStore } = openObjectStoreTransaction(db, store);
    const index = objectStore.index(key);
    const keyRange = IDBKeyRange.only(+id);
    const cursorRequest = index.openCursor(keyRange);
    const response = [];
    cursorRequest.onsuccess = function (event) {
      const target = event.target as IDBRequest<IDBCursorWithValue>;
      const result = target.result;
      const data = result?.value;
      if (data) {
        response.push({
          ...data,
          id: result.primaryKey,
        });
        result.continue();
      } else {
        resolve(response);
      }
    };
  });

export const deleteEntry = (
  db: IDBDatabase,
  store: string,
  id: number,
): Promise<boolean> =>
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
export const updateEntry = <Type>(
  db: IDBDatabase,
  store: string,
  id: number,
  data: Type,
): Promise<Type> =>
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
      requestUpdate.onerror = (err) => {
        let message = 'unable to update entry';
        if (err instanceof Error) {
          message = err.message;
        }
        reject(message);
      };

      // Success - the data is updated!
      requestUpdate.onsuccess = (event) => {
        const target = event.target as IDBRequest<IDBCursorWithValue>;
        resolve({ ...newValue, id: target.result });
      };
    };
  });

export const createEntry = <Type>(
  db: IDBDatabase,
  store: string,
  data: Type,
): Promise<Type> =>
  new Promise((resolve, reject) => {
    const { transaction, objectStore } = openObjectStoreTransaction(db, store);
    const request = objectStore.add({
      ...data,
      created: new Date().getTime(),
    });
    request.onsuccess = (event) => {
      const target = event.target as IDBRequest<IDBCursorWithValue>;
      resolve({
        ...data,
        id: target.result,
        created: new Date().getTime(),
      });
    };

    transaction.onerror = function (err) {
      let message = 'unable to create entry';
      if (err instanceof Error) {
        message = err.message;
      }
      reject(message);
    };
  });
