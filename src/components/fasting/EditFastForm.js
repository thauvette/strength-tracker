import { h } from 'preact';
import { useState } from 'preact/hooks';

const EditFastForm = ({ initialValues, handleSubmit }) => {
  const [formValues, setFormValues] = useState({ ...initialValues });

  const submit = () => {
    const endDateTime =
      formValues.endDate && formValues.endTime
        ? new Date(`${formValues.endDate}T${formValues.endTime}:00`).getTime()
        : null;
    handleSubmit({
      start: new Date(
        `${formValues.startDate}T${formValues.startTime}:00`,
      ).getTime(),
      end: endDateTime,
    });
  };

  const handleInput = (e) => {
    setFormValues({
      ...formValues,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div>
      <p class="text-lg text-center font-bold my-2">Start</p>
      <label class="flex items-center py-1">
        <p class="w-2/4 ">Date *</p>
        <input
          class="w-2/4"
          type="date"
          value={formValues.startDate}
          onInput={handleInput}
          name="startDate"
          placeholder="date"
        />
      </label>
      <label class="flex items-center py-1">
        <p class="w-2/4">Time *</p>
        <input
          class="w-2/4"
          type="time"
          onInput={handleInput}
          value={formValues.startTime}
          name="startTime"
          placeholder="time"
        />
      </label>
      <p class="text-lg text-center font-bold my-2">End</p>
      <label class="flex items-center py-1">
        <p class="w-2/4">Date</p>
        <input
          class="w-2/4"
          type="date"
          value={formValues.endDate}
          onInput={handleInput}
          name="endDate"
          placeholder="date"
        />
      </label>
      <label class="flex items-center py-1">
        <p class="w-2/4">Time</p>
        <input
          class="w-2/4"
          type="time"
          onInput={handleInput}
          value={formValues.endTime}
          name="endTime"
          placeholder="time"
        />
      </label>
      <button
        disabled={!formValues.startDate || !formValues.startTime}
        onClick={submit}
        class="bg-primary-900 text-white"
      >
        Save
      </button>
    </div>
  );
};

export default EditFastForm;
