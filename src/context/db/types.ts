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
