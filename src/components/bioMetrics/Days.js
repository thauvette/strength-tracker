import { h } from 'preact';
import BioMetricForm from './bioMetricForm';
import Day from './Day';

const Days = ({
  days,
  setEditModalState,
  initialFormValues,
  handleAddEntry,
  name,
}) => (
  <div class="py-4">
    <BioMetricForm
      initialValues={initialFormValues}
      submit={(data) => {
        handleAddEntry(data);
      }}
      name={name}
      submitText="Add New +"
    />
    <h2 class="mb-2">History</h2>
    {days?.map((day) => (
      <Day key={day.dayKey} day={day} setEditModalState={setEditModalState} />
    ))}
  </div>
);

export default Days;
