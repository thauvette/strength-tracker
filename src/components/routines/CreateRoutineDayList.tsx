import { h } from 'preact';
import Icon from '../icon/Icon';
import { Link } from 'preact-router';
import { routes } from '../../config/routes';
import EditableSetList, { Set } from '../EditableSetList';
import Accordion from '../accordion/accordion';

interface Props {
  routineName: string;
  setRoutineName: (name: string) => void;
  days: { id: string; name: string; sets: Set[] }[];
  updateDayName: (id: string, name: string) => void;
  removeDay: (id: string) => void;
  addDay: () => void;
  updateDaySets: (id: string, sets: Set[]) => void;
  submit: () => void;
}

const CreateRoutineDayList = ({
  routineName,
  setRoutineName,
  days,
  updateDayName,
  removeDay,
  addDay,
  updateDaySets,
  submit,
}: Props) => {
  return (
    <div class="px-2 py-4">
      <h1>New Routine</h1>
      <div class="mb-4">
        <label>
          <p>Routine Name</p>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={routineName}
            onInput={(e) => {
              if (e.target instanceof HTMLInputElement) {
                setRoutineName(e.target.value);
              }
            }}
          />
        </label>
      </div>
      {days.map((day) => (
        <div key={day.id} class="py-4 border-b-2">
          <div class="flex justify-between">
            <input
              type="text"
              value={day.name || ''}
              onInput={(e) => {
                if (e.target instanceof HTMLInputElement) {
                  updateDayName(day.id, e.target.value);
                }
              }}
            />
            <button
              class="flex items-center gap-1  text-sm"
              onClick={() => removeDay(day.id)}
              aria-label="remove day"
            >
              <Icon name="trash-outline" />
            </button>
          </div>
          <Accordion title={`Sets: (${day.sets.length})`}>
            {day.sets.length ? (
              <EditableSetList
                sets={day.sets}
                setSets={(newSets) => {
                  updateDaySets(day.id, newSets);
                }}
              />
            ) : (
              <p>No sets</p>
            )}
          </Accordion>
          <div class="mt-4 flex">
            <Link
              class="secondary py-2 w-full text-center"
              href={`${routes.routinesNew}/${day.id}`}
            >
              Add/Edit/Analyse
            </Link>
          </div>
        </div>
      ))}
      <button onClick={addDay}>+ Add a day</button>
      <div class="fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
        <button class="primary w-full" onClick={submit}>
          Save Routine
        </button>
      </div>
    </div>
  );
};

export default CreateRoutineDayList;
