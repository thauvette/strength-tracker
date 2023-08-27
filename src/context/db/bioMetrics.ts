import get from 'lodash.get';
import { objectStores } from './config';
import { openObjectStoreTransaction } from './utils/dbUtils';

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
