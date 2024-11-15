import { useEffect, useReducer } from 'preact/hooks';
import { AugmentedExercise } from '../context/db/types';
import useDB from '../context/db/db';

interface State {
  [key: string]: {
    data?: AugmentedExercise;
    isLoading: boolean;
    error: null | string;
  };
}

interface Action {
  id: number;
  type: string;
  data?: AugmentedExercise;
  error?: string;
}
const reducer = (state: State, action: Action): State => {
  if (action.type === 'Fetch_Data') {
    return {
      ...state,
      [action.id]: {
        isLoading: true,
      },
    };
  }
  if (action.type === 'Receive_Data') {
    return {
      ...state,
      [action.id]: {
        isLoading: false,
        data: action.data,
      },
    };
  }
  if (action.type === 'Fetch_Error') {
    return {
      ...state,
      [action.id]: {
        isLoading: false,
        error: action.error,
      },
    };
  }

  return {
    ...state,
  };
};

const useAugmentSetData = ({ exerciseIds }: { exerciseIds: number[] }) => {
  const { getAugmentedExercise } = useDB();
  const [state, dispatch] = useReducer(reducer, {});

  const fetchItem = async (id: number) => {
    try {
      dispatch({
        type: 'Fetch_Data',
        id,
      });
      const data = await getAugmentedExercise(id);
      dispatch({
        type: 'Receive_Data',
        id,
        data,
      });
      return data;
    } catch (err) {
      dispatch({
        id,
        type: 'Fetch_Error',
        error: `no data for exercise id: ${id}`,
      });
      throw err;
    }
  };

  const handleFetchAll = async (ids: number[]) => {
    const promises = ids
      .filter((id) => {
        return !state[id]?.isLoading && !state[id]?.error && !state[id]?.data;
      })
      .map((id) => fetchItem(id));

    await Promise.all(promises);
  };

  useEffect(() => {
    void handleFetchAll(exerciseIds);
  }, [exerciseIds]); // eslint-disable-line
  return {
    ...state,
  };
};

export default useAugmentSetData;
