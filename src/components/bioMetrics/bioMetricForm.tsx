import { h } from 'preact';
import { useState } from 'preact/hooks';
import dayjs from 'dayjs';
import dateFormats from '../../config/dateFormats';
import useToast from '../../context/toasts/Toasts';

interface Props {
  initialValues: {
    [key: string]: number;
  };
  submit: (args: { value: number; date: number }) => void;
  name: string;
  submitText?: string;
  renderCtas?: (args: { submit: (e: Event) => void }) => void;
}

const BioMetricForm = ({
  initialValues,
  submit,
  name,
  submitText = 'Add +',
  renderCtas = null,
}: Props) => {
  const [date, setDate] = useState(
    initialValues?.date || dayjs().format(dateFormats.day),
  );
  const [time, setTime] = useState(
    initialValues?.time || dayjs().format(dateFormats.time),
  );
  const [value, setValue] = useState(initialValues?.value || null);
  const { fireToast } = useToast();
  const handleAddEntry = (e: Event) => {
    e.preventDefault();
    submit({
      value,
      date: dayjs(`${date}T${time}:00`).toDate().getTime(),
    });
    fireToast({
      text: `${name} added`,
    });
  };

  return (
    <form onSubmit={handleAddEntry} class="pb-4">
      <label class="flex items-center py-1">
        <p class="w-2/4 capitalize">{name}</p>
        <input
          class="w-2/4"
          value={value ?? 0}
          type="number"
          step="0.01"
          onInput={(e) => {
            if (e.target instanceof HTMLInputElement) {
              setValue(+e.target.value);
            }
          }}
          placeholder={name || ''}
        />
      </label>
      <label class="flex items-center py-1">
        <p class="w-2/4">Date</p>
        <input
          class="w-2/4"
          type="date"
          value={date}
          onInput={(e) => {
            if (e.target instanceof HTMLInputElement) {
              setDate(e.target.value);
            }
          }}
          placeholder="date"
        />
      </label>
      <label class="flex items-center py-1">
        <p class="w-2/4">Time</p>
        <input
          class="w-2/4"
          type="time"
          onInput={(e) => {
            if (e.target instanceof HTMLInputElement) {
              setTime(e.target.value);
            }
          }}
          value={time}
          placeholder="time"
        />
      </label>
      {renderCtas ? (
        renderCtas({
          submit: handleAddEntry,
        })
      ) : (
        <button class="btn primary w-full mt-4" type="submit">
          {submitText}
        </button>
      )}
    </form>
  );
};

export default BioMetricForm;
