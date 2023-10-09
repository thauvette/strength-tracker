declare module '*.scss' {
  const content: Record<string, string>;
  export default content;
}

export interface SimpleSet {
  reps: number;
  weight: number;
  isWarmpUp: boolean;
}
