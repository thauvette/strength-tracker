import get from 'lodash.get';
import { objectStores } from './config';
import { openObjectStoreTransaction } from './utils/dbUtils';
import { ObjectStoreEvent } from './types';

export const createBioMetric = (
  db: IDBDatabase,
  name: string,
): Promise<{
  name: string;
  id: number;
}> =>
  new Promise((resolve) => {
    const { objectStore } = openObjectStoreTransaction(
      db,
      objectStores.bioMetrics,
    );

    const addRequest = objectStore.add({
      name,
      created: new Date().getTime(),
    });
    addRequest.onerror = (e) => console.warn(e);
    addRequest.onsuccess = (event) => {
      resolve({
        name,
        id: get(event, 'target.result', null),
      });
    };
  });

export const getAllBioById = (db: IDBDatabase, id: number) =>
  new Promise((resolve, reject) => {
    const { objectStore: dataStore } = openObjectStoreTransaction(
      db,
      objectStores.bioMetrics,
    );
    const keyRange = IDBKeyRange.only(+id);

    const cursorRequest = dataStore.openCursor(keyRange);
    cursorRequest.onsuccess = (event: ObjectStoreEvent) => {
      const { objectStore: entryStore } = openObjectStoreTransaction(
        db,
        objectStores.bioEntries,
      );
      if (!event?.target?.result) {
        reject(new Error('Not found'));
      }
      // entryStore
      const index = entryStore.index('bioMetric');
      const request = index.getAll(+id);
      request.onsuccess = (reqEvent: ObjectStoreEvent) => {
        resolve({
          data: event?.target?.result?.value,
          entries: reqEvent?.target?.result,
        });
      };
      request.onerror = (err) => {
        reject(err);
      };
    };
    cursorRequest.onerror = (err) => {
      reject(err);
    };
  });
