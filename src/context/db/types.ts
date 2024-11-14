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

export interface HydratedBioEntry extends BioEntry {
  name: string;
}

// MUSCLE GROUPS
export interface MuscleGroup {
  name: string;
  isPrimary: 0 | 1;
  parentGroup: number | null;
  id: number;
  secondaryGroups?: {
    name: string;
    isPrimary: 0 | 1;
    parentGroup: number;
    id: number;
  }[];
}

// export interface HydratedMuscleGroup {
//   name: string;
//   isPrimary: 0 | 1;
//   parentGroup: number | null;
//   id: number;
//   secondaryGroups: {
//     name: string;
//     id: number;
//     isPrimary: 0 | 1;
//     parentGroup: number;
//   }[];
// }
// Exercises
export interface DBExercise {
  created: number;
  updated?: number;
  name: string;
  primaryGroup: number;
  musclesWorked: number[];
  secondaryMusclesWorked: number[];
  type: string;
  barWeight: number;
  id: number;
}
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
  updated?: number;
  id: number;
}

export interface ExerciseHistory {
  barWeight?: number | undefined;
  isFavorite?: boolean;
  musclesWorked: MuscleGroup[];
  name: string;
  notes?: string;
  primaryGroup: number;
  primaryGroupData?: {
    name: string;
  };
  secondaryMusclesWorked: MuscleGroup[];
  type: string;
  updated?: number;
  items: SetType[];
}

export interface Set {
  reps: number;
  weight: number;
  exercise: number;
  isWarmUp: boolean;
  note?: string;
}

export interface DbStoredSet {
  reps: number;
  weight: number;
  created: number;
  exercise: number;
  updated?: number;
  isWarmUp?: boolean;
  note?: string;
}

export interface AugmentedDataSet extends DbStoredSet {
  exerciseData: Exercise;
  primaryMuscles: MuscleGroup[];
  primaryMuscleGroup: MuscleGroup;
  secondaryMuscles: MuscleGroup[];
  name: string;
  musclesWorked: number[];
  barWeight: number;
  secondaryMusclesWorked: number[];
  primaryGroup: number;
  type: string;
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

// export interface CreateRoutineBody {
//   name: string;
//   days: {
//     id: string;
//     name: string;
//     sets: {
//       id: string;
//       exercise: number;
//       reps: number;
//       weight: number;
//     }[];
//   };
// }

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

// TODO: fix the any's and unknowns
export interface IDBContext {
  isInitialized: boolean;
  // WENDLER
  getWendlerCycle: (id: string) => Promise<unknown>;
  getWendlerExercises: () => Promise<unknown>;
  createCycle: (data: unknown) => Promise<unknown>;
  updateWendlerItem: ({ id, path, value }) => Promise<unknown>;
  // SETS
  createOrUpdateLoggedSet: (id: number, data: Set) => Promise<Set>;
  deleteLoggedSet: (id: number) => Promise<boolean>;
  getTodaySets: () => Promise<AugmentedDataSet[]>;
  getSetsByDay: (date: Date) => Promise<AugmentedDataSet[]>;
  getSetsByDateRange: (start: Date, end: Date) => Promise<AugmentedDataSet[]>;
  // EXERCISES
  getExerciseOptions: () => Promise<{
    [key: string]: MuscleGroup & {
      items: Exercise[];
    };
  }>;
  getExerciseHistoryById: (id: number) => Promise<ExerciseHistory>;
  getExercise: (id: number) => Promise<unknown>;
  // SYNC
  createBackup: () => void;
  restoreFromBackup: (entries: unknown) => Promise<unknown>;
  // BIO METRICS
  createBioMetric: (name: string) => Promise<BioMetric>;
  getAllBioById: (id: number) => Promise<unknown>;
  getBioEntriesByDateRange: (
    startDate: string,
    endDate: string,
  ) => Promise<HydratedBioEntry[]>;
  // MUSCLES
  getMuscleGroups: () => Promise<{
    [key: string]: MuscleGroup;
  }>;
  // ROUTINES
  getRoutines: () => Promise<Routine[]>;
  getRoutine: (id: number) => Promise<unknown>;
  createRoutine: (data: Routine) => Promise<{
    data: Routine;
    id: number;
  }>;
  updateRoutine: (id: number, data: Partial<Routine>) => Promise<Routine>;
  updateSingleRoutineSet: (
    id: number,
    dayId: string,
    set: Set,
  ) => Promise<unknown>;
  duplicateRoutine: (id: number) => Promise<{
    data: Routine;
    id: number;
  }>;
  // GENERIC + ENTRIES
  getItem: (store: string, id: number) => Promise<unknown>;
  getAllEntries: <Type>(store: string) => Promise<{ [key: string]: Type }>;
  deleteEntry: (store: string, id: number) => Promise<unknown>;
  createEntry: (store: string, data: unknown) => Promise<unknown>;
  updateEntry: (store: string, id: number, data: unknown) => Promise<unknown>;
}
