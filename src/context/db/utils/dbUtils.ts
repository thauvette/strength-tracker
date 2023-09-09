import { objectStores } from './../config';
import {
  BioEntry,
  BioMetric,
  Exercise,
  Fast,
  HydratedSet,
  MuscleGroup,
} from './../types';
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

// https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads
export function getFromCursor(
  db: IDBDatabase,
  store: 'bio_metrics',
): Promise<{ [key: number]: BioMetric }>;
export function getFromCursor(
  db: IDBDatabase,
  store: 'bio_metric_entries',
): Promise<{ [key: number]: BioEntry }>;
export function getFromCursor(
  db: IDBDatabase,
  store: 'exercises',
): Promise<{ [key: number]: Exercise }>;
export function getFromCursor(
  db: IDBDatabase,
  store: 'fasting',
): Promise<{ [key: number]: Fast }>;
export function getFromCursor(
  db: IDBDatabase,
  store: 'muscle_groups',
): Promise<{ [key: number]: MuscleGroup }>;
export function getFromCursor(
  db: IDBDatabase,
  store: 'routines',
): Promise<{ [key: number]: any }>;
export function getFromCursor(
  db: IDBDatabase,
  store: 'wendler_cycles',
): Promise<{ [key: number]: any }>;
export function getFromCursor(
  db: IDBDatabase,
  store: 'sets',
): Promise<{ [key: number]: HydratedSet }>;
export function getFromCursor(
  db: IDBDatabase,
  store: string,
): Promise<{ [key: number]: any }>;
export function getFromCursor(
  db: IDBDatabase,
  store: string,
): Promise<{ [key: number]: any }> {
  return new Promise((resolve, reject) => {
    const { transaction, objectStore } = openObjectStoreTransaction(db, store);
    const results = {};
    objectStore.openCursor().onsuccess = (event: ObjectStoreEvent) => {
      const cursor = event.target.result;
      if (cursor) {
        results[cursor.key] =
          store === objectStores.exercises
            ? formatExercise(cursor.value)
            : cursor.value;
        cursor.continue();
      }
    };
    transaction.oncomplete = () => resolve(results);

    transaction.onerror = () => {
      reject(new Error('oops'));
    };
  });
}

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
