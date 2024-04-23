import { h } from 'preact';
import dayjs from 'dayjs';
import { useCallback, useEffect, useState } from 'preact/hooks';
import DateRangePicker from '../components/DateRangePicker';
import useDB from '../context/db/db';
import MuscleList from '../components/analysis/MuscleList';
import formatAnalysis from '../utilities.js/formatAnalysis';

const WorkoutAnalysis = () => {
  const today = dayjs();
  const { getSetsByDateRange, getMuscleGroups } = useDB();
  const [{ startDate, endDate }, setDates] = useState({
    startDate: today.subtract(6, 'days').format('YYYY-MM-DD'),
    endDate: today.format('YYYY-MM-DD'),
  });
  const [data, setData] = useState({
    muscleGroupings: null,
    exercises: null,
    days: null,
    workingSets: 0,
  });

  const submit = useCallback(() => {
    setData({
      muscleGroupings: null,
      exercises: null,
      days: null,
      workingSets: 0,
    });

    return Promise.all([
      getSetsByDateRange(dayjs(startDate).toDate(), dayjs(endDate).toDate()),
      getMuscleGroups(),
    ]).then(([sets, muscles]) => {
      const { exercises, days, result } = formatAnalysis(sets, muscles);
      setData({
        muscleGroupings: result,
        exercises,
        days,
        workingSets: sets?.filter(({ isWarmUp }) => !isWarmUp)?.length || 0,
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
      days: null,
      workingSets: 0,
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
          useLogs
        />
      </div>
      {data?.days && (
        <div class="text-lg form-bold mb-4">
          <p class="">Total Workouts: {Object.keys(data.days).length}</p>
          <p>Total working sets: {data.workingSets}</p>
        </div>
      )}
      <MuscleList
        title="Muscle Groupings"
        data={primaryGroups}
        workingSets={data.workingSets}
      />
      <MuscleList
        title="Primary Targets"
        data={mainMuscles}
        workingSets={data.workingSets}
      />
      <MuscleList
        title="Secondary Targets"
        data={secondary}
        workingSets={data.workingSets}
      />
    </div>
  );
};

export default WorkoutAnalysis;
