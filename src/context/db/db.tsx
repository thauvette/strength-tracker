import { useState, createContext, useContext, useMemo } from 'preact/compat';
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
import { Exercise, IDBContext } from './types';
import useOnMount from '../../hooks/useOnMount';

const DBContext = createContext<IDBContext | { isInitialized: boolean }>(null);

export const DBProvider = ({ children }) => {
  const [db, setDb] = useState<IDBDatabase | null>();

  // INITIALIZE OUR DB
  useOnMount(() => {
    initializeDb(setDb);
  });

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
  const context = useContext(DBContext);
  if (!context) {
    throw new Error('useDB must be inside DBContextProvider');
  }
  return context;
}
