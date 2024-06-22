import { LogsSet } from '../../context/db/types';

export const logsCalendarReducer = (
  state: {
    [key: string]: {
      loading: boolean;
      data?: {
        [key: string]: LogsSet[];
      };
    };
  } = {},
  action: {
    type: string;
    payload: {
      date: string;
      data?: {
        [key: string]: LogsSet[];
      };
    };
  },
) => {
  switch (action.type) {
    case 'FETCH_DATA':
      return {
        ...state,
        [action.payload.date]: {
          loading: true,
        },
      };
    case 'RECEIVE_DATA':
      return {
        ...state,
        [action.payload.date]: {
          loading: false,
          data: action.payload.data,
        },
      };
    default:
      return state;
  }
};
