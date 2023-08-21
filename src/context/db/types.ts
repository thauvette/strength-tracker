// Object Stores
export type possibleStores =
  | 'wendler_cycles'
  | 'exercises'
  | 'sets'
  | 'bio_metrics'
  | 'bio_metric_entries'
  | 'muscle_groups'
  | 'fasting'
  | 'routines';

// BIO METRICS
export interface BioMetric {
  name: String;
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
