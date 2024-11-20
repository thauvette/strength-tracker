import getClosestTimeStamp from '../../utilities.js/getClosestTimeStamp';
import { objectStores } from './config';
import { getAllEntriesByKey } from './entries';
import {
  AugmentedExercise,
  BioEntry,
  Exercise,
  ExerciseHistory,
  MuscleGroup,
  ObjectStoreEvent,
} from './types';
import { getFromCursor, openObjectStoreTransaction } from './utils/dbUtils';

export const getExerciseOptions = (
  db: IDBDatabase,
): Promise<{
  [key: string]: MuscleGroup & {
    items: Exercise[];
  };
}> =>
  new Promise((resolve) => {
    // need to get exercises and muscle groups and connect
    // then together.
    getFromCursor<MuscleGroup>(db, 'muscle_groups').then(
      async (muscleGroupsObject: { [key: number]: MuscleGroup }) => {
        const exercises = await getFromCursor<Exercise>(db, 'exercises');
        const data = Object.entries(exercises || {}).reduce(
          (obj, [exerciseId, exercise]) => {
            const muscleGroupData = muscleGroupsObject[exercise.primaryGroup];
            const currentGroup = obj[exercise.primaryGroup] || {
              ...muscleGroupData,
              id: exercise.primaryGroup,
              items: [],
            };

            currentGroup.items.push({
              ...exercise,
              id: +exerciseId,
            });

            return {
              ...obj,
              [exercise.primaryGroup]: currentGroup,
            };
          },
          {},
        );
        return resolve(data);
      },
    );
  });

export const getExerciseById = (
  db: IDBDatabase,
  id: number,
): Promise<Exercise> =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(
      db,
      objectStores.exercises,
    );
    const keyRange = IDBKeyRange.only(+id);

    const cursorRequest = objectStore.openCursor(keyRange);
    cursorRequest.onsuccess = (event: ObjectStoreEvent) => {
      resolve({
        ...(event?.target?.result?.value || {}),
        barWeight: event?.target?.result?.value?.barWeight ?? 45,
        id: event?.target?.result.primaryKey,
      });
    };
    cursorRequest.onerror = (err) => {
      reject(err);
    };
  });

export const getExerciseHistoryById = (
  db: IDBDatabase,
  id: number,
): Promise<ExerciseHistory> =>
  new Promise((resolve) => {
    getAugmentedExercise(db, id).then(async (exerciseResponse) => {
      const weights = await getAllEntriesByKey<BioEntry>(
        db,
        objectStores.bioEntries,
        'bioMetric',
        1,
      );
      const weightEntries = weights?.reduce(
        (obj, item) => ({
          ...obj,
          [item.created]: item,
        }),
        {},
      );

      const sortedKeys = weights
        ?.map((item) => item.created)
        ?.sort((a, b) => a - b);

      const { objectStore } = openObjectStoreTransaction(db, objectStores.sets);
      const results = [];
      // get all sets for this exercise
      const index = objectStore.index('exercise');
      const keyRange = IDBKeyRange.only(+id);
      const cursorRequest = index.openCursor(keyRange);
      cursorRequest.onsuccess = async function (event: ObjectStoreEvent) {
        const data = event?.target?.result?.value;
        if (data) {
          const result = { ...data, id: event?.target?.result?.primaryKey };

          // find the closets bw record
          const closetsKey = getClosestTimeStamp(sortedKeys, result.created);
          const closetsRecord = closetsKey ? weightEntries[closetsKey] : null;

          if (closetsRecord?.value) {
            result.bw = closetsRecord.value;
          }
          results.push(result);
          event?.target?.result.continue();
        } else {
          resolve({
            ...exerciseResponse,
            items: results,
          });
        }
      };
    });
  });

export const getAugmentedExercise = async (
  db: IDBDatabase,
  id: number,
): Promise<AugmentedExercise> => {
  try {
    const exerciseResponse = await getExerciseById(db, id);
    if (!exerciseResponse) {
      throw new Error('404');
    }
    const muscleGroupData = await getFromCursor<MuscleGroup>(
      db,
      'muscle_groups',
    );
    const musclesWorked =
      exerciseResponse.musclesWorked?.map((id) => ({
        ...(muscleGroupData?.[id] || null),
        id,
      })) || [];
    const secondaryMusclesWorked =
      exerciseResponse.secondaryMusclesWorked?.map((id) => ({
        ...(muscleGroupData?.[id] || null),
        id,
      })) || [];

    return {
      ...exerciseResponse,
      primaryMuscleIds: exerciseResponse.musclesWorked || [],
      secondaryMuscleIds: exerciseResponse.secondaryMusclesWorked || [],
      musclesWorked,
      secondaryMusclesWorked,
      primaryGroupData: muscleGroupData?.[exerciseResponse?.primaryGroup],
    };
  } catch (err) {
    let message = 'oops';
    if (err instanceof Error) {
      message = err.message;
    }
    throw new Error(message);
  }
};
