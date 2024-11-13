import get from 'lodash.get';
import dayjs from 'dayjs';
import { objectStores } from './config';
import { getFromCursor, openObjectStoreTransaction } from './utils/dbUtils';
import {
  BioEntry,
  BioMetric,
  HydratedBioEntry,
  ObjectStoreEvent,
} from './types';

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

const getEntriesByRange = async (
  db: IDBDatabase,
  start: number,
  end: number,
): Promise<BioEntry[]> =>
  new Promise((resolve) => {
    const range = IDBKeyRange.bound(start, end);
    const { objectStore, transaction } = openObjectStoreTransaction(
      db,
      objectStores.bioEntries,
    );
    const index = objectStore.index('date');
    const results = [];
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

export const getBioEntriesByDateRange = async (
  db,
  startDate,
  endDate,
): Promise<HydratedBioEntry[]> => {
  try {
    const bioMetrics: { [key: string]: BioMetric } = await getFromCursor(
      db,
      objectStores.bioMetrics,
    );
    const entries = await getEntriesByRange(
      db,
      dayjs(startDate).startOf('day').toDate().getTime(),
      dayjs(endDate).endOf('day').toDate().getTime(),
    );
    return (
      entries?.map((entry) => ({
        ...entry,
        name: bioMetrics?.[entry.bioMetric]?.name || '',
      })) || []
    );
  } catch (err) {
    throw new Error(err?.message || 'error get bio metrics');
  }
};
