import { h } from 'preact';
import { useState, createContext, useContext } from 'preact/compat';
import dayjs from 'dayjs';
import useDB from './db/db';
import Modal from '../components/modal/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import Icon from '../components/icon/Icon';
import { Link } from 'preact-router';
import { routes } from '../config/routes';
import dateFormats from '../config/dateFormats';

const DayHistoryModalContext = createContext(null);

export const DayHistoryModalContextProvider = ({ children }) => {
  const [{ isOpen, isLoading, data, day }, setState] = useState({
    isOpen: false,
    isLoading: false,
    data: null,
  });
  const { getSetsByDay } = useDB();
  const showDayHistory = (date) => {
    setState({
      isOpen: true,
      isLoading: true,
      data: null,
      day: null,
    });
    getSetsByDay(date).then((res) => {
      setState({
        isOpen: true,
        isLoading: false,
        day: date,
        data: res.reduce((arr, set) => {
          const currentIndex = arr
            .map((item) => item.exerciseId)
            .indexOf(set.exercise);

          if (currentIndex === -1) {
            arr.push({
              exerciseId: set.exercise,
              name: set.exerciseData?.name,
              sets: [set],
            });
          } else {
            arr[currentIndex].sets.push(set);
          }

          return arr;
        }, []),
      });
    });
  };
  const closeModal = () =>
    setState({
      isOpen: false,
      isLoading: false,
      data: null,
      day: null,
    });

  return (
    <DayHistoryModalContext.Provider
      value={{
        showDayHistory,
      }}
    >
      {children}
      <Modal isOpen={isOpen} onRequestClose={closeModal}>
        {isLoading && <LoadingSpinner />}
        {data && (
          <div>
            <div class="flex justify-between items-center pb-4">
              <h1 class="text-2xl">
                {dayjs(day).format(dateFormats.dayDisplay)}
              </h1>
              <button onClick={closeModal}>Close X</button>
            </div>
            {data.length > 0 ? (
              <div>
                {data.map((group) => (
                  <div key={group.exerciseId}>
                    <div class="flex justify-between">
                      <p class="font-bold text-lg capitalize">{group.name}</p>
                      <Link
                        onClick={closeModal}
                        href={`${routes.exerciseBase}/${group.exerciseId}`}
                        aria-label={`go to ${group.name}`}
                      >
                        <Icon name="open" />
                      </Link>
                    </div>
                    {group.sets.length > 0
                      ? group.sets.map((set) => (
                          <p key={set.created}>
                            {set.reps} @ {set.weight}{' '}
                            {set.isWarmUp && '(warm up)'}
                            <span class="text-sm">
                              {' - '}
                              {dayjs(set.created).format(
                                dateFormats.timeToSeconds,
                              )}
                            </span>
                          </p>
                        ))
                      : null}
                  </div>
                ))}
              </div>
            ) : (
              <p>No history </p>
            )}
          </div>
        )}
      </Modal>
    </DayHistoryModalContext.Provider>
  );
};

const useDayHistoryContext = () => useContext(DayHistoryModalContext);

export default useDayHistoryContext;
