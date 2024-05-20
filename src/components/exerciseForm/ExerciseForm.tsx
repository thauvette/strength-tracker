import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import useDB from '../../context/db/db';
import { objectStores } from '../../context/db/config';

import exerciseTypes from '../../config/exerciseTypes';
import MuscleGroupsCheckList from './MuscleGroupsCheckList';
import Accordion from '../accordion/accordion';

import useToast from '../../context/toasts/Toasts';
import Counters from '../counters/Counters';
import Body from '../async/body';
import { MuscleGroup } from '../../context/db/types';

interface Props {
  initialValues: {
    name?: string;
    primaryGroup: number;
    musclesWorked: number[];
    secondaryMusclesWorked: number[];
    notes: string;
    barWeight?: number;
    exerciseType: string;
  };
  title?: string;
  id?: number;
  onSubmit: (res: unknown) => void;
}

const ExerciseForm = ({ onSubmit, initialValues, id = null, title }: Props) => {
  const { createEntry, getMuscleGroups, updateEntry } = useDB();
  const { fireToast } = useToast();
  const [primaryGroupOptions, setPrimaryGroupOptions] = useState([]);
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    primaryGroup: initialValues?.primaryGroup || '',
    musclesWorked: initialValues?.musclesWorked || [],
    secondaryMusclesWorked: initialValues?.secondaryMusclesWorked || [],
    notes: initialValues?.notes || '',
    type: 'wr',
    barWeight: initialValues?.barWeight || 45,
  });

  const getData = () => {
    getMuscleGroups().then((res: { [key: string]: MuscleGroup }) => {
      setPrimaryGroupOptions(
        Object.values(res || {})
          .filter((option) => !!option.isPrimary)
          .sort((a, b) => (a.name < b.name ? -1 : 1)),
      );
    });
  };

  useEffect(() => {
    getData();
  }, []); // eslint-disable-line

  const submit = async (e) => {
    const {
      name,
      primaryGroup,
      musclesWorked,
      secondaryMusclesWorked,
      type,
      notes,
      barWeight,
    } = formData;

    const data = {
      name,
      musclesWorked,
      secondaryMusclesWorked,
      type,
      primaryGroup: +primaryGroup,
      notes,
      barWeight,
    };
    let res;
    if (id) {
      res = await updateEntry(objectStores.exercises, id, data);
    } else {
      res = await createEntry(objectStores.exercises, data);
    }
    if (onSubmit) {
      e.stopPropagation();
      onSubmit(res);
    }
    fireToast({
      text: `${name} updated`,
    });
  };

  const formIsValid = !!(formData.name.length && formData.primaryGroup);
  return !primaryGroupOptions ? (
    <p>Loading</p>
  ) : (
    <div class="p-4">
      {title && <h2>Add Exercise</h2>}
      <div class="pb-2">
        <label>
          <p>Name</p>
          <input
            class="w-full"
            type="text"
            value={formData.name}
            onInput={(e) => {
              if (e.target instanceof HTMLInputElement) {
                setFormData({
                  ...formData,
                  name: e.target.value,
                });
              }
            }}
          />
        </label>
      </div>
      <div class="pb-2">
        <label>
          <p>Notes</p>
          <textarea
            class="w-full"
            type="text"
            value={formData.notes}
            onInput={(e) => {
              if (e.target instanceof HTMLInputElement) {
                setFormData({
                  ...formData,
                  notes: e.target.value,
                });
              }
            }}
          />
        </label>
      </div>

      <div class="pb-2">
        <label>
          <p>Exercise type</p>
          <select
            class="w-full"
            value={formData.type}
            onInput={(e) => {
              if (e.target instanceof HTMLInputElement) {
                setFormData({
                  ...formData,
                  type: e.target.value,
                });
              }
            }}
          >
            {exerciseTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.label}
              </option>
            ))}
          </select>
          <p class="text-sm italic">
            Note: Only Weight and reps is fully supported, I'm hoping to add the
            others soon.
          </p>
        </label>
      </div>

      <p>Primary Muscle Group (for sorting)</p>
      {!!primaryGroupOptions?.length && (
        <div class="pb-4">
          <select
            class="w-full"
            value={formData.primaryGroup}
            onInput={(e) => {
              if (e.target instanceof HTMLSelectElement) {
                setFormData({
                  ...formData,
                  primaryGroup: e.target.value,
                });
              }
            }}
          >
            <option value="">Select Primary Group</option>
            {primaryGroupOptions.map((option) => (
              <option key={option.id} value={option.id} class="capitalize">
                {option.name}
              </option>
            ))}
          </select>
          <hr class="my-6" />
          <Body
            activePrimary={formData?.musclesWorked || []}
            activeSecondary={formData?.secondaryMusclesWorked || []}
          />
          <div class="my-4">
            <Accordion
              title={
                <>
                  Primary Muscles
                  {formData?.musclesWorked?.length > 0 ? (
                    <span class="pl-2 text-sm">
                      {formData?.musclesWorked?.length}
                    </span>
                  ) : null}
                </>
              }
              titleClass="capitalize font-bold text-lg"
            >
              <div class="pl-6 border-b">
                <MuscleGroupsCheckList
                  groups={primaryGroupOptions}
                  formData={formData}
                  setFormData={setFormData}
                  formKey="musclesWorked"
                />
              </div>
            </Accordion>
          </div>
          <div class="my-4">
            <Accordion
              title={
                <>
                  Secondary Muscles{' '}
                  {formData?.secondaryMusclesWorked?.length > 0 ? (
                    <span class="pl-2 text-sm">
                      {formData?.secondaryMusclesWorked?.length}
                    </span>
                  ) : null}
                </>
              }
              titleClass="capitalize font-bold text-lg"
            >
              <div class="pl-6 border-b">
                <MuscleGroupsCheckList
                  groups={primaryGroupOptions}
                  formData={formData}
                  setFormData={setFormData}
                  formKey="secondaryMusclesWorked"
                />
              </div>
            </Accordion>
          </div>
        </div>
      )}

      <div class="pb-8">
        <p class="mb-4">Bar weight: </p>
        <Counters
          value={formData.barWeight}
          setValue={(val) => {
            setFormData({
              ...formData,
              barWeight: val,
            });
          }}
          roundToFive
          jumpBy={5}
        />
      </div>

      <div class="pt-4 fixed bottom-0 right-0 left-0 text-center">
        <button
          class="primary w-full max-w-lg mx-auto"
          disabled={!formIsValid}
          onClick={submit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default ExerciseForm;
