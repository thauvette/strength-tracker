import { useEffect, useCallback, useReducer } from 'preact/hooks';
import dayjs from 'dayjs';

import useDB from '../../context/db/db.tsx';
import { formatHistory } from './utils';

const initialState = {
  exerciseHistory: null,
  savedSet: { weight: 0, reps: 0, isWarmUp: true },
  isLoading: false,
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'GET_HISTORY': {
      return {
        ...state,
        isLoading: true,
        exerciseHistory: null,
      };
    }
    case 'RECEIVE_HISTORY':
      return {
        ...state,
        isLoading: false,
        exerciseHistory: action.payload,
      };
    case 'RECEIVE_HISTORY_WITH_SET':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };
    case 'UPDATE_SAVED_SET':
      return {
        ...state,
        savedSet: action.payload,
      };

    default:
      return state;
  }
};

const useExerciseHistory = (id) => {
  const { getExerciseHistoryById } = useDB();
  const [state, dispatch] = useReducer(reducer, null, () => initialState);

  const getData = (isNewId) => {
    if (!id) {
      return null;
    }

    return getExerciseHistoryById(+id)
      .then((res) => {
        const formattedHistory = formatHistory({
          items: res?.items,
          includeBwInHistory: res.type === 'bwr',
        });

        const itemsArrays = Object.values(formattedHistory.items || {});
        const lastIndex = Object.values(formattedHistory?.items || {})?.length
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
          volumeByDay: formattedHistory.volumeByDay,
        };

        if (isNewId) {
          const lastSet =
            result?.todaysHistory?.[result?.todaysHistory?.length - 1];
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
          dispatch({
            type: 'RECEIVE_HISTORY_WITH_SET',
            payload: {
              exerciseHistory: result,
              savedSet: initialValues,
            },
          });
          return result;
        }
        dispatch({
          type: 'RECEIVE_HISTORY',
          payload: result,
        });
        return result;
      })
      .catch((err) => {
        console.warn(err);
        throw err;
      });
  };

  const cachedGet = useCallback(getData, [id]); // eslint-disable-line
  const updateSavedSet = (values) => {
    dispatch({
      type: 'UPDATE_SAVED_SET',
      payload: values,
    });
  };

  useEffect(() => {
    dispatch({
      type: 'GET_HISTORY',
    });
    cachedGet(true);
  }, [id, cachedGet]);

  return {
    exerciseHistory: state.exerciseHistory,
    getData: cachedGet,
    savedSet: state.savedSet,
    setSavedSet: updateSavedSet,
    isLoading: state.isLoading,
  };
};

export default useExerciseHistory;
