export interface SimpleSet {
  reps: number;
  weight: number;
  isWarmUp: boolean;
}

export interface RoutineSet {
  barWeight?: number; // TODO: remove this. and add it to a hook for hydrating content.
  created?: number;
  exercise: number;
  exerciseName: string;
  id?: number; // matches it to a set in the DB
  isWarmUp: boolean;
  reps: number;
  weight: number;
  routineSetId?: string;
}
