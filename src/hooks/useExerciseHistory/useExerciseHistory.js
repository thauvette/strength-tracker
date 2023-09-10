import { useState, useEffect } from 'preact/hooks';
import dayjs from 'dayjs';

import useDB from '../../context/db/db.tsx';
import { formatHistory } from './utils';

const useExerciseHistory = (id) => {
  const { getExerciseHistoryById } = useDB();
  const [exerciseHistory, setExerciseHistory] = useState(null);
  const [savedSet, setSavedSet] = useState({
    weight: 0,
    reps: 0,
    isWarmUp: true,
  });

  const getData = (isNewId) =>
    id
      ? getExerciseHistoryById(+id)
          .then((res) => {
            const formattedHistory = formatHistory({
              items: res?.items,
              includeBwInHistory: res.type === 'bwr',
            });

            const itemsArrays = Object.values(formattedHistory.items || {});
            const lastIndex = Object.values(formattedHistory?.items || {})
              ?.length
              ? Object.values(formattedHistory?.items || {})?.length - 1
              : 0;

            const lastWorkOutSorted = itemsArrays?.[lastIndex]?.sort((a, b) =>
              a.create < b.create ? -1 : 1,
            );

            const lastWorkoutFirstSet = lastWorkOutSorted?.[0] || null;
            const lastWorkoutHeaviestSet =
              lastWorkOutSorted?.reduce((obj, set) => {
                if (!obj || +obj.weight < +set.weight) {
                  return set;
                }
                return obj;
              }, null) || null;

            const result = {
              ...res,
              items: formattedHistory.items,
              eorm: formattedHistory.eorm,
              raw: res.items,
              prs: formattedHistory.prs,
              prsWithBW: formattedHistory.prsWithBW,
              id: +id,
              lastWorkout: {
                heaviestSet: lastWorkoutHeaviestSet,
                firstSet: lastWorkoutFirstSet,
              },
              todaysHistory:
                formattedHistory.items?.[dayjs().format('YYYY-MM-DD')] || [],
            };

            if (isNewId) {
              const lastSet =
                result?.todaysHistory?.[res?.todaysHistory?.length - 1];
              const lastWorkoutFirstSet = result?.lastWorkout?.firstSet;

              const initialValues = lastSet
                ? {
                    weight: lastSet.weight,
                    reps: lastSet.reps,
                    isWarmUp: !!lastSet.isWarmUp,
                  }
                : lastWorkoutFirstSet
                ? {
                    weight: lastWorkoutFirstSet.weight,
                    reps: lastWorkoutFirstSet.reps,
                    isWarmUp: !!lastWorkoutFirstSet.isWarmUp,
                  }
                : {
                    weight: 0,
                    reps: 0,
                    isWarmUp: true,
                  };
              setSavedSet(initialValues);
            }

            setExerciseHistory(result);
            return result;
          })
          .catch((err) => {
            console.log(err);
            throw err;
          })
      : null;

  useEffect(() => {
    setExerciseHistory(null);
    getData(true);
  }, [id]); // eslint-disable-line

  return { exerciseHistory, getData, savedSet, setSavedSet };
};

export default useExerciseHistory;
