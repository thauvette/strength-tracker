export const objectStores: {
  [key: string]: string;
} = {
  wendlerCycles: 'wendler_cycles',
  exercises: 'exercises',
  sets: 'sets',
  bioMetrics: 'bio_metrics',
  bioEntries: 'bio_metric_entries',
  muscleGroups: 'muscle_groups',
  fasting: 'fasting',
  routines: 'routines',
};

export type possibleStores =
  | 'wendler_cycles'
  | 'exercises'
  | 'sets'
  | 'bio_metrics'
  | 'bio_metric_entries'
  | 'muscle_groups'
  | 'fasting'
  | 'routines';

export const DB_VERSION: number = 8;
export const DB_NAME: string = 'track_strength';
