import { h } from 'preact';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'preact/hooks';
import cloneDeep from 'lodash.clonedeep';
import DateRangePicker from '../components/DateRangePicker';
import useDB from '../context/db/db';
import MuscleList from '../components/analysis/MuscleList';

const WorkoutAnalysis = () => {
  const today = dayjs();
  const { getSetsByDateRange, getMuscleGroups } = useDB();
  const [{ startDate, endDate }, setDates] = useState({
    startDate: today.subtract(7, 'days').format('YYYY-MM-DD'),
    endDate: today.format('YYYY-MM-DD'),
  });
  const [data, setData] = useState({
    muscleGroupings: null,
    exercises: null,
  });

  const submit = useCallback(() => {
    setData({
      muscleGroupings: null,
      exercises: null,
    });

    return Promise.all([
      getSetsByDateRange(startDate, endDate),
      getMuscleGroups(),
    ]).then(([sets, muscles]) => {
      const exercises = {};

      const result = sets.reduce(
        (obj, set) => {
          const exerciseId = set.exercise;
          const currentSets = exercises[exerciseId]?.sets || [];
          currentSets.push(set);
          exercises[exerciseId] = {
            ...(set.exerciseData || {}),
            sets: currentSets,
          };

          const primeId = set?.exerciseData?.primaryGroup;
          const currentPrimeSets = obj.primaryGroups[primeId]?.sets || [];
          currentPrimeSets.push(set);
          const primeData = muscles[primeId];

          // musclesWorked, secondaryMusclesWorked
          const currentMain = cloneDeep(obj.mainMuscles);
          const currentSecondary = cloneDeep(obj.secondaryMuscles);
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
              const currentSecondarySets =
                currentSecondary?.[muscleId]?.sets || [];
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
      setData({
        muscleGroupings: result,
        exercises,
      });
    });

    // get sets in range
  }, [startDate, endDate]); // eslint-disable-line

  useEffect(() => {
    if (startDate && endDate) {
      submit();
      return;
    }
    setData({
      muscleGroupings: null,
      exercises: null,
    });
  }, [startDate, endDate, submit]);

  const primaryGroups = data?.muscleGroupings?.primaryGroups;
  const mainMuscles = data?.muscleGroupings?.mainMuscles;
  const secondary = data?.muscleGroupings?.secondaryMuscles;

  return (
    <div>
      <h1>Analysis</h1>
      <div class="p-4">
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChangeDate={setDates}
        />
      </div>
      <MuscleList title="Muscle Groupings" data={primaryGroups} />
      <MuscleList title="Primary Targets" data={mainMuscles} />
      <MuscleList title="Secondary Targets" data={secondary} />
    </div>
  );
};

export default WorkoutAnalysis;
