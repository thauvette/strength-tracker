// BIO METRICS
export interface BioMetric {
  name: string;
  created?: Date;
}

export interface BioEntry {
  bioMetric: number;
  created: number;
  date: Date;
  value: number;
}

export interface HydradedBioEntry extends BioEntry {
  name: string;
}

export interface BioEntriesResponse {
  [key: number]: BioEntry;
}

// MUSCLE GROUPS
export interface MuscleGroup {
  name: string;
  isPrimary: 0 | 1;
  parentGroup: number | null;
}
export interface HydratedMuscleGroup {
  name: string;
  isPrimary: 0 | 1;
  parentGroup: number | null;
  id: number;
  secondaryGroups: {
    name: string;
    id: number;
    isPrimary: 0 | 1;
    parentGroup: number;
  }[];
}
// Exercises
export interface Exercise {
  barWeight?: number | undefined;
  created?: number | undefined;
  isFavorite?: boolean;
  musclesWorked: number[];
  name: string;
  notes?: string;
  primaryGroup: number;
  secondaryMusclesWorked: number[];
  type: string;
  updated: number | undefined;
}

export interface ExerciseHistory {
  barWeight?: number | undefined;
  isFavorite?: boolean;
  musclesWorked: MuscleGroup[];
  name: string;
  notes?: string;
  primaryGroup: number;
  secondaryMusclesWorked: MuscleGroup[];
  type: string;
  updated: number;
  items: SetType[];
}

export interface ExerciseOptions extends MuscleGroup {
  id: number;
  items: Exercise[];
}

export interface SetType {
  created: number;
  exercise: number;
  reps: number;
  updated: number;
  weight: number;
  isWarmUp: boolean;
  id: number;
  note?: string;
}

export interface HydratedSet extends SetType {
  bw?: number;
  exerciseData: Exercise;
  id: number;
  name?: string;
  exerciseName?: string;
  barWeight?: number;
}

export interface LogsSet extends HydratedSet {
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  primaryMuscleGroup: MuscleGroup;
  name: string;
  musclesWorked: number[];
  barWeight: number;
  secondaryMusclesWorked: number[];
  primaryGroup: number;
  type: string;
}

export interface Fast {
  created: number;
  start: number;
  end: number;
  updated: number;
}

export interface CreateRoutineBody {
  name: string;
  days: {
    id: string;
    name: string;
    sets: {
      id: string;
      exercise: number;
      reps: number;
      weight: number;
    }[];
  };
}

export interface Routine {
  created: number;
  name: string;
  id: number;
  days: {
    id: string;
    name: string;
    sets: {
      exercise: number;
      exerciseName: string;
      id?: number;
      routineSetId?: string;
      reps: number;
      weight: number;
      barWeight: number;
    }[];
  }[];
}

export interface ObjectStoreEvent extends Event {
  target: IDBRequest;
}
// TODO: add wendler cycle to this.
export type DbStoreTypes =
  | BioEntry
  | BioMetric
  | Exercise
  | Fast
  | MuscleGroup
  | Routine
  | SetType;

// TODO: fix the anys and unknowns
export interface IDBContext {
  isInitialized: false;
  // WENDLER
  getWendlerCycle: (id: string) => Promise<any>;
  getWendlerExercises: () => Promise<any>;
  createCycle: (data) => Promise<any>;
  updateWendlerItem: ({ id, path, value }) => Promise<any>;
  // SETS
  createOrUpdateLoggedSet: (
    id: number,
    data: {
      exercise: number;
      reps: number;
      weight: number;
      isWarmUp?: boolean;
      notes?: string;
    },
  ) => Promise<HydratedSet>;
  deleteLoggedSet: (id) => Promise<boolean>;
  getTodaySets: () => Promise<LogsSet[]>;
  getSetsByDay: (date: Date) => Promise<LogsSet[]>;
  getSetsByDateRange: (start: Date, end: Date) => Promise<LogsSet[]>;
  // EXERCISES
  getExerciseOptions: () => Promise<{
    [key: string]: MuscleGroup & {
      items: Exercise[];
    };
  }>;
  getExerciseHistoryById: (id) => Promise<unknown>;
  getExercise: (id: number) => Promise<unknown>;
  // SYNC
  createBackup: () => Promise<unknown>;
  restoreFromBackup: (entries) => Promise<unknown>;
  // BIO METRICS
  createBioMetric: (name) => Promise<BioMetric>;
  getAllBioById: (id) => Promise<unknown>;
  getBioEntriesByDateRange: (
    startDate: string,
    endDate: string,
  ) => Promise<unknown>;
  // MUSCLES
  getMuscleGroups: () => Promise<unknown>;
  // ROUTINES
  getRoutines: () => Promise<unknown>;
  getRoutine: (id: number) => Promise<unknown>;
  createRoutine: (data) => Promise<unknown>;
  updateRoutine: (id, data) => Promise<unknown>;
  updateSingleRoutineSet: (id, dayId, set) => Promise<unknown>;
  duplicateRoutine: (id) => Promise<unknown>;
  // GENERIC + ENTRIES
  getItem: (store, id) => Promise<unknown>;
  getAllEntries: <Type>(store: string) => Promise<Type>;
  deleteEntry: (store: string, id: number) => Promise<unknown>;
  createEntry: (store, data) => Promise<unknown>;
  updateEntry: (store, id, data) => Promise<unknown>;
}
