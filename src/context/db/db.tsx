import {
  useEffect,
  useState,
  createContext,
  useContext,
  useMemo,
} from 'preact/compat';
import dayjs from 'dayjs';

import { getFromCursor, getItem } from './utils/dbUtils';
import initializeDb from './initializeDb.js';
import {
  getWendlerExercises,
  updateWendlerItem,
  getWendlerCycle,
  createCycle,
} from './wendler.js';
import {
  createBioMetric,
  getAllBioById,
  getBioEntriesByDateRange,
} from './bioMetrics';
import { createEntry, deleteEntry, updateEntry } from './entries.js';
import {
  createOrUpdateLoggedSet,
  deleteLoggedSet,
  getSetsByDateRange,
} from './sets';
import {
  createRoutine,
  duplicateRoutine,
  getRoutine,
  getRoutines,
  updateRoutine,
  updateSingleRoutineSet,
} from './routines';
import { getExerciseHistoryById, getExerciseOptions } from './exercises';
import { getMuscleGroups } from './muscles';
import { createBackup, restoreFromBackup } from './sync';
import { objectStores } from './config';
import { Exercise } from './types';

const DBContext = createContext({
  isInitialized: false,
  // WENDLER
  getWendlerCycle: (id: string) => getWendlerCycle(null, id),
  getWendlerExercises: () => getWendlerExercises(null),
  createCycle: (data) => createCycle(null, data),
  updateWendlerItem: ({ id, path, value }) =>
    updateWendlerItem(null, { id, path, value }),
  // SETS
  createOrUpdateLoggedSet: (id, data) =>
    createOrUpdateLoggedSet(null, id, data),
  deleteLoggedSet: (id) => deleteLoggedSet(null, id),
  getTodaySets: () => {
    const today = dayjs().toDate();
    return getSetsByDateRange(null, today, today);
  },
  getSetsByDay: (date: Date) => getSetsByDateRange(null, date, date),
  getSetsByDateRange: (start: Date, end: Date) =>
    getSetsByDateRange(null, start, end),
  // EXERCISES
  getExerciseOptions: () => getExerciseOptions(null),
  getExerciseHistoryById: (id) => getExerciseHistoryById(null, id),
  getExercise: (id: number) =>
    getItem<Exercise>(null, objectStores.exercises, id),
  // SYNC
  createBackup: () => createBackup(null),
  restoreFromBackup: (entries) => restoreFromBackup(null, entries),
  // BIO METRICS
  createBioMetric: (name) => createBioMetric(null, name),
  getAllBioById: (id) => getAllBioById(null, id),
  getBioEntriesByDateRange: (startDate: string, endDate: string) =>
    getBioEntriesByDateRange(null, startDate, endDate),
  // MUSCLES
  getMuscleGroups: () => getMuscleGroups(null),
  // ROUTINES
  getRoutines: () => getRoutines(null),
  getRoutine: (id: number) => getRoutine(null, id),
  createRoutine: (data) => createRoutine(null, data),
  updateRoutine: (id, data) => updateRoutine(null, id, data),
  updateSingleRoutineSet: (id, dayId, set) =>
    updateSingleRoutineSet(null, id, dayId, set),
  duplicateRoutine: (id) => duplicateRoutine(null, id),
  // GENERIC + ENTRIES
  getItem: (store, id) => getItem(null, store, id),
  getAllEntries: <Type,>(store: string) => getFromCursor<Type>(null, store),
  deleteEntry: (store: string, id: number) => deleteEntry(null, store, id),
  createEntry: (store, data) => createEntry(null, store, data),
  updateEntry: (store, id, data) => updateEntry(null, store, id, data),
});

export const DBProvider = ({ children }) => {
  const [db, setDb] = useState<IDBDatabase>();

  // INITIALIZE OUR DB
  useEffect(() => {
    initializeDb(setDb);
  }, []); // eslint-disable-line

  const memoizedValue = useMemo(
    () => ({
      isInitialized: !!db,
      // WENDLER
      getWendlerCycle: (id: string) => getWendlerCycle(db, id),
      getWendlerExercises: () => getWendlerExercises(db),
      createCycle: (data) => createCycle(db, data),
      updateWendlerItem: ({ id, path, value }) =>
        updateWendlerItem(db, { id, path, value }),
      // SETS
      createOrUpdateLoggedSet: (id, data) =>
        createOrUpdateLoggedSet(db, id, data),
      deleteLoggedSet: (id) => deleteLoggedSet(db, id),
      getTodaySets: () => {
        const today = dayjs().toDate();
        return getSetsByDateRange(db, today, today);
      },
      getSetsByDay: (date: Date) => getSetsByDateRange(db, date, date),
      getSetsByDateRange: (start, end) => getSetsByDateRange(db, start, end),
      // EXERCISES
      getExerciseOptions: () => getExerciseOptions(db),
      getExerciseHistoryById: (id) => getExerciseHistoryById(db, id),
      getExercise: (id: number) =>
        getItem<Exercise>(db, objectStores.exercises, id),
      // SYNC
      createBackup: () => createBackup(db),
      restoreFromBackup: (entries) => restoreFromBackup(db, entries),
      // BIO METRICS
      createBioMetric: (name) => createBioMetric(db, name),
      getAllBioById: (id) => getAllBioById(db, id),
      getBioEntriesByDateRange: (startDate: string, endDate: string) =>
        getBioEntriesByDateRange(db, startDate, endDate),
      // MUSCLES
      getMuscleGroups: () => getMuscleGroups(db),
      // ROUTINES
      getRoutines: () => getRoutines(db),
      getRoutine: (id) => getRoutine(db, id),
      createRoutine: (data) => createRoutine(db, data),
      updateRoutine: (id, data) => updateRoutine(db, id, data),
      updateSingleRoutineSet: (id, dayId, set) =>
        updateSingleRoutineSet(db, id, dayId, set),
      duplicateRoutine: (id) => duplicateRoutine(db, id),
      // GENERIC + ENTRIES
      getItem: (store, id) => getItem(db, store, id),
      getAllEntries: <Type,>(store: string) => getFromCursor<Type>(db, store),
      deleteEntry: (store: string, id: number) => deleteEntry(db, store, id),
      createEntry: (store, data) => createEntry(db, store, data),
      updateEntry: (store, id, data) => updateEntry(db, store, id, data),
    }),
    [db],
  );

  return (
    <DBContext.Provider value={memoizedValue}>{children}</DBContext.Provider>
  );
};

export default function useDB() {
  return useContext(DBContext);
}
