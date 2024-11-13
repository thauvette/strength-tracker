import dayjs from 'dayjs';
import { AugmentedDataSet, MuscleGroup } from '../context/db/types';

const formatAnalysis = (
  sets: AugmentedDataSet[],
  muscles: { [key: string]: MuscleGroup },
) => {
  const exercises = {};
  const days = {};
  const result = sets.reduce(
    (obj, set) => {
      const exerciseId = set.exercise;
      const currentSets = exercises[exerciseId]?.sets || [];
      currentSets.push(set);
      const dayKey = dayjs(set.created).format('YYYY-MM-DD');
      const day = days[dayKey] || [];
      day.push(set);
      days[dayKey] = day;
      exercises[exerciseId] = {
        ...(set.exerciseData || {}),
        sets: currentSets,
      };

      const primeId = set?.exerciseData?.primaryGroup;
      const currentPrimeSets = obj.primaryGroups[primeId]?.sets || [];
      currentPrimeSets.push(set);
      const primeData = muscles[primeId];

      // musclesWorked, secondaryMusclesWorked
      const currentMain = { ...obj.mainMuscles };
      const currentSecondary = { ...obj.secondaryMuscles };
      if (set.exerciseData?.musclesWorked?.length) {
        set.exerciseData.musclesWorked.forEach((muscleId) => {
          const muscleData = muscles[muscleId];
          const currentMainSets = currentMain?.[muscleId]?.sets || [];
          currentMainSets.push(set);
          currentMain[muscleId] = {
            ...muscleData,
            sets: currentMainSets,
          };
        });
      }
      if (set.exerciseData?.secondaryMusclesWorked?.length) {
        set.exerciseData.secondaryMusclesWorked.forEach((muscleId) => {
          const muscleData = muscles[muscleId];
          const currentSecondarySets = currentSecondary?.[muscleId]?.sets || [];
          currentSecondarySets.push(set);
          currentSecondary[muscleId] = {
            ...muscleData,
            sets: currentSecondarySets,
          };
        });
      }

      return {
        ...obj,
        primaryGroups: {
          ...obj.primaryGroups,
          [primeId]: {
            ...(primeData || {}),
            sets: currentPrimeSets,
          },
        },
        mainMuscles: currentMain,
        secondaryMuscles: currentSecondary,
      };
    },
    {
      primaryGroups: {},
      mainMuscles: {},
      secondaryMuscles: {},
    },
  );

  return {
    result,
    exercises,
    days,
  };
};

export default formatAnalysis;
