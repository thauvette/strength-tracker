import dayjs from 'dayjs';
import {
  ARRAY_SEPARATOR,
  COMMA_REPLACEMENT,
  LINE_BREAK,
} from '../../config/constants';
import { objectStores } from './config';
import { getFromCursor } from './utils/dbUtils';
import formatExercise from './utils/formatExercise';

export async function generateBackupData(db: IDBDatabase) {
  const arr = [];
  const headerItems = ['store', 'id'];

  for (const storeName of Array.from(db.objectStoreNames)) {
    const entries = await getFromCursor(db, storeName);
    if (Object.keys(entries || {}).length) {
      Object.entries(entries).forEach(([id, data]) => {
        const rowData: any[] = [storeName, id];
        if (Object.keys(data || {}).length) {
          Object.entries(data).forEach(([key, val]) => {
            const currentIndex = headerItems.indexOf(key);
            const position =
              currentIndex === -1 ? headerItems.length : currentIndex;

            if (currentIndex === -1) {
              headerItems.push(key);
            }

            let formattedValue = val;

            // in the case of routines and wendler cycles we have some json to deal with
            if (
              (storeName === objectStores.routines && key === 'days') ||
              (storeName === objectStores.wendlerCycles &&
                (key === 'exerciseFormValues' || key === 'weeks'))
            ) {
              formattedValue = btoa(JSON.stringify(val));
            } else if (Array.isArray(val)) {
              formattedValue = val.join(ARRAY_SEPARATOR);
            } else if (typeof val === 'string') {
              formattedValue = val
                .replace(/[\r\n]/gm, LINE_BREAK)
                .replace(',', COMMA_REPLACEMENT);
            }
            rowData[position] = formattedValue;
          });
        }

        arr.push(rowData.join());
      });
    }
  }
  return `${headerItems.join()}\n${arr.join('\n')}`;
}

export const createBackup = (db) => {
  generateBackupData(db).then((res) => {
    const hiddenElement = document.createElement('a');
    hiddenElement.href = `data:text/csv;charset=utf-8, ${encodeURI(res)}`;
    hiddenElement.target = '_blank';
    hiddenElement.download = `strength-track-${dayjs().format('YYYY-MM-DD')}`;
    hiddenElement.click();
  });
};

const clearStore = (db, store) =>
  new Promise((resolve, reject) => {
    try {
      const objectStoreRequest = db
        .transaction([store], 'readwrite')
        .objectStore(store)
        .clear();

      objectStoreRequest.onsuccess = () => {
        return resolve({ success: true, store });
      };
      objectStoreRequest.onerror = () =>
        reject(`unable to clear data from ${store}`);
    } catch (err) {
      console.warn(err);
      return reject(err?.message || `unable to clear data from ${store}`);
    }
  });

const writeItemFromBackup = (db, item) =>
  new Promise((resolve, reject) => {
    const { store, data, id } = item;

    const result =
      store === objectStores.exercises ? formatExercise(data) : data;

    const objectStore = db
      .transaction([store], 'readwrite')
      .objectStore(store)
      .put(result, id);

    objectStore.onsuccess = () => resolve(item);

    objectStore.onerror = (err) => reject(err);
  });

export const restoreFromBackup = async (db, entries) => {
  try {
    // get list of stores to clear.
    const storeClearPromises = entries.stores.map((store) =>
      clearStore(db, store)
        .then((res) => res)
        .catch((err) => {
          return {
            store,
            error: err,
          };
        }),
    );

    const itemPromises = entries.items.map((item) =>
      writeItemFromBackup(db, item)
        .then((res) => res)
        .catch((err) => {
          return {
            ...item,
            error: err,
          };
        }),
    );

    const storesResponse = await Promise.all(storeClearPromises);
    const itemResponses = await Promise.all(itemPromises);

    return {
      storesResponse,
      itemResponses,
    };
  } catch (err) {
    return Promise.reject(err?.message || 'Unable to restore data');
  }
};
