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
import { createBioMetric } from './bioMetrics';
import { createEntry, deleteEntry, updateEntry } from './entries.js';
import {
  createOrUpdateLoggedSet,
  deleteLoggedSet,
  getAllSetsHistory,
  getSetsByDateRange,
} from './sets.js';
import { createRoutine, updateRoutine } from './routines.js';
import { getExerciseHistoryById, getExerciseOptions } from './exercises';
import { getMuscleGroups } from './muscles';
import { createBackup, restoreFromBackup } from './sync';
import { HydratedSet, SetType } from './types';

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
  getAllSetsHistory: () => getAllSetsHistory(null),
  getTodaySets: () => {
    const today = dayjs().toDate();
    return getSetsByDateRange(null, today, today);
  },
  getSetsByDay: (date: string): Promise<SetType[]> =>
    getSetsByDateRange(null, date, date),
  getSetsByDateRange: (start, end): Promise<HydratedSet[]> =>
    getSetsByDateRange(null, start, end),
  // EXERCISES
  getExerciseOptions: () => getExerciseOptions(null),
  getExerciseHistoryById: (id) => getExerciseHistoryById(null, id),
  // SYNC
  createBackup: () => createBackup(null),
  restoreFromBackup: (entries) => restoreFromBackup(null, entries),
  // BIO METRICS
  createBioMetric: (name) => createBioMetric(null, name),
  // MUSCLES
  getMuscleGroups: () => getMuscleGroups(null),
  // ROUTINES
  createRoutine: (data) => createRoutine(null, data),
  updateRoutine: (id, data) => updateRoutine(null, id, data),
  // GENERIC + ENTRIES
  getItem: (store, id) => getItem(null, store, id),
  getAllEntries: (store: string) => getFromCursor(null, store),
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
      getAllSetsHistory: () => getAllSetsHistory(db),
      getTodaySets: () => {
        const today = dayjs().toDate();
        return getSetsByDateRange(db, today, today);
      },
      getSetsByDay: (date: string): Promise<HydratedSet[]> =>
        getSetsByDateRange(db, date, date),
      getSetsByDateRange: (start, end): Promise<HydratedSet[]> =>
        getSetsByDateRange(db, start, end),
      // EXERCISES
      getExerciseOptions: () => getExerciseOptions(db),
      getExerciseHistoryById: (id) => getExerciseHistoryById(db, id),
      // SYNC
      createBackup: () => createBackup(db),
      restoreFromBackup: (entries) => restoreFromBackup(db, entries),
      // BIO METRICS
      createBioMetric: (name) => createBioMetric(db, name),
      // MUSCLES
      getMuscleGroups: () => getMuscleGroups(db),
      // ROUTINES
      createRoutine: (data) => createRoutine(db, data),
      updateRoutine: (id, data) => updateRoutine(db, id, data),
      // GENERIC + ENTRIES
      getItem: (store, id) => getItem(db, store, id),
      getAllEntries: (store) => getFromCursor(db, store),
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
