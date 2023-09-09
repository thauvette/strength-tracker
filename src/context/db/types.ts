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
  musclesWorked: number[];
  name: string;
  primaryGroup: number;
  secondaryMusclesWorked: number[];
  type: string;
  updated: number | undefined;
  created: number | undefined;
  barWeight?: number | undefined;
}

export interface SetType {
  created: number;
  exercise: number;
  reps: number;
  updated: number;
  weight: number;
  isWarmUp: boolean;
}

export interface HydratedSet extends SetType {
  bw?: number;
  exerciseData: Exercise;
  id: number;
}

export interface Fast {
  created: number;
  start: number;
  end: number;
  updated: number;
}

export interface Routine {
  created: number;
  name: string;
  days: {
    id: string;
    name: string;
    sets: {
      exercise: number;
      exerciseName: string;
      id: string;
      reps: number;
      weight: number;
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
