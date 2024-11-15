import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Route, Router, route } from 'preact-router';

import generateRandomId from '../../utilities.js/generateRandomId';
import useDB from '../../context/db/db';

import { routes } from '../../config/routes';
import CreateRoutineDayList from './CreateRoutineDayList';
import CreateRouteDay from './CreateRouteDay';
import { RoutineSet } from '../../types/types';
import { Routine, RoutineDay } from '../../context/db/types';

const formatSetForStorage = (set: RoutineSet) => ({
  exercise: set.exercise,
  exerciseName: set.exerciseName,
  isWarmUp: set.isWarmUp,
  reps: set.reps,
  routineSetId: set.routineSetId ?? generateRandomId(),
  weight: set.weight,
  // barWeight needed OR, removed and added to hook
});

const CreateRoutine = ({ initialValues }) => {
  const { createRoutine, updateRoutine } = useDB();
  const [routineName, setRoutineName] = useState<string>(
    initialValues?.name || '',
  );
  const [days, setDays] = useState<
    {
      name: string;
      id: string;
      sets: RoutineSet[];
    }[]
  >(
    initialValues?.days?.map((day: RoutineDay) => ({
      ...day,
      sets:
        day?.sets?.map((set) => ({
          ...set,
          exerciseId: set.exercise,
        })) || [],
    })) || [
      {
        name: 'Day 1',
        id: generateRandomId(),
        sets: [],
      },
    ],
  );

  const addDay = () => {
    const number = days?.length + 1;
    setDays([
      ...days,
      {
        name: `Day ${number}`,
        id: generateRandomId(),
        sets: [],
      },
    ]);
  };

  const updateDayName = (id: string, value: string) => {
    setDays(
      days.map((day) =>
        id === day.id
          ? {
              ...day,
              name: value,
            }
          : day,
      ),
    );
  };
  const removeDay = (id: string) =>
    setDays(days.filter((day) => day.id !== id));

  const submit = async () => {
    const data = {
      name: routineName,
      days: days.map(
        (day: { name: string; id: string; sets: RoutineSet[] }) => ({
          name: day.name,
          id: day.id,
          sets: day.sets?.map((set) => formatSetForStorage(set)) || [],
        }),
      ),
    };
    let res:
      | {
          id: number;
          data: Routine;
        }
      | undefined;
    try {
      if (initialValues?.id) {
        res = await updateRoutine(initialValues.id, data);
      } else {
        res = await createRoutine(data);
      }
    } catch (e) {
      // do nothing
    }
    if (res?.id) {
      route(`${routes.routinesBase}/${res?.id}`);
    }
  };

  const updateDaySets = (dayId: string, sets: RoutineSet[]) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            sets: sets.map((set) => formatSetForStorage(set)),
          };
        }
        return day;
      }),
    );
    route(`${routes.routinesNew}/`);
  };

  return (
    <Router>
      <Route
        component={CreateRoutineDayList}
        path={`${routes.routinesNew}/`}
        routineName={routineName}
        setRoutineName={setRoutineName}
        days={days}
        updateDayName={updateDayName}
        removeDay={removeDay}
        addDay={addDay}
        updateDaySets={updateDaySets}
        submit={submit}
      />
      <Route
        path={`${routes.routinesNew}/:dayId/:remaining_path*`}
        component={CreateRouteDay}
        days={days}
        updateDay={updateDaySets}
      />
    </Router>
  );
};

export default CreateRoutine;
