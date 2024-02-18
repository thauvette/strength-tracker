import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Route, Router, route } from 'preact-router';

import generateRandomId from '../../utilities.js/generateRandomId';
import useDB from '../../context/db/db.tsx';

import { routes } from '../../config/routes';
import CreateRoutineDayList from './CreateRoutineDayList.tsx';
import CreateRouteDay from './CreateRouteDay.tsx';

const CreateRoutine = ({ initialValues }) => {
  const { createRoutine, updateRoutine } = useDB();
  const [routineName, setRoutineName] = useState(initialValues?.name || '');
  const [days, setDays] = useState(
    initialValues?.days?.map((day) => ({
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
  const updateDayName = (id, value) => {
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
  const removeDay = (id) => setDays(days.filter((day) => day.id !== id));

  const submit = async () => {
    const data = {
      name: routineName,
      days: days.map((day) => ({
        name: day.name,
        id: day.id,
        sets:
          day.sets?.map((set) => ({
            weight: set.weight,
            reps: set.reps,
            exercise: set.exerciseId,
            exerciseName: set.exerciseName,
            routineSetId: set.id,
          })) || [],
      })),
    };
    let res;
    try {
      if (initialValues?.id) {
        res = await updateRoutine(initialValues.id, data);
      } else {
        res = await createRoutine(data);
      }
    } catch (e) {
      // do nothing
    }
    route(`${routes.routinesBase}/${res?.id}`);
  };

  const updateDaySets = (dayId, sets) => {
    setDays(
      days.map((day) => {
        if (day.id === dayId) {
          return {
            ...day,
            sets,
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
