import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import useDB from '../../context/db/db'
import { objectStores } from '../../context/db/config'

import exerciseTypes from '../../config/exerciseTypes'
import MuscleGroupsCheckList from './MuscleGroupsCheckList'
import Accordion from '../accordion/accordion'

import Modal from '../../components/modal/Modal'
import NewMuscleGroupForm from './NewMuscleGroupForm'
import useToast from '../../context/toasts/Toasts'
import Counters from '../counters/Counters'
import Body from '../async/body'

const ExerciseForm = ({ onSubmit, initialValues, id = null }) => {
  const { createEntry, getMuscleGroups, updateEntry } = useDB()
  const { fireToast } = useToast()
  const [primaryGroupOptions, setPrimaryGroupOptions] = useState([])
  const [formData, setFormData] = useState({
    name: initialValues?.name || '',
    primaryGroup: initialValues?.primaryGroup || '',
    altPrimary: initialValues?.altPrimary || '',
    musclesWorked: initialValues?.musclesWorked || [],
    secondaryMusclesWorked: initialValues?.secondaryMusclesWorked || [],
    notes: initialValues?.notes || '',
    type: 'wr',
    barWeight: initialValues?.barWeight || 45,
  })
  const [newMuscleGroupModalIsOpen, setNewMuscleGroupModalIsOpen] =
    useState(false)

  const getData = () => {
    getMuscleGroups().then((res) => {
      setPrimaryGroupOptions(
        Object.values(res || {})
          .filter((option) => !!option.isPrimary)
          .sort((a, b) => (a.name < b.name ? -1 : 1)),
      )
    })
  }

  useEffect(() => {
    getData()
  }, []) // eslint-disable-line

  const submit = async (e) => {
    const {
      name,
      primaryGroup,
      altPrimary,
      musclesWorked,
      secondaryMusclesWorked,
      type,
      notes,
      barWeight,
    } = formData

    let newPrimaryId
    let newPrimary
    if (primaryGroup === 'other') {
      newPrimary = await createEntry(objectStores.muscleGroups, {
        name: altPrimary.toLowerCase(),
        isPrimary: 1,
      })
      if (newPrimary) {
        newPrimaryId = newPrimary?.id
      }
    }

    const data = {
      name,
      musclesWorked,
      secondaryMusclesWorked,
      type,
      primaryGroup: newPrimaryId ? +newPrimaryId : +primaryGroup,
      notes,
      barWeight,
    }
    let res
    if (id) {
      res = await updateEntry(objectStores.exercises, id, data)
    } else {
      res = await createEntry(objectStores.exercises, data)
      if (newPrimary) {
        setPrimaryGroupOptions((currentOptions) => [
          ...currentOptions,
          newPrimary,
        ])
      }
    }
    if (onSubmit) {
      e.stopPropagation()
      onSubmit(res)
    }
    fireToast({
      text: `${name} updated`,
    })
  }

  const formIsValid =
    formData.name.length &&
    formData.primaryGroup &&
    (formData.primaryGroup !== 'other' || formData.altPrimary?.length)

  return !primaryGroupOptions ? (
    <p>Loading</p>
  ) : (
    <div class="p-4">
      <h2>Add Exercise</h2>
      <div class="pb-2">
        <label>
          <p>Name</p>
          <input
            class="w-full"
            type="text"
            value={formData.name}
            onInput={(e) =>
              setFormData({
                ...formData,
                name: e.target.value,
              })
            }
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
            onInput={(e) =>
              setFormData({
                ...formData,
                notes: e.target.value,
              })
            }
          />
        </label>
      </div>

      <div class="pb-2">
        <label>
          <p>Exercise type</p>
          <select
            class="w-full"
            value={formData.type}
            onInput={(e) =>
              setFormData({
                ...formData,
                type: e.target.value,
              })
            }
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
            onInput={(e) =>
              setFormData({
                ...formData,
                primaryGroup: e.target.value,
              })
            }
          >
            <option value="">Select Primary Group</option>
            {primaryGroupOptions.map((option) => (
              <option key={option.id} value={option.id} class="capitalize">
                {option.name}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {formData?.primaryGroup === 'other' && (
            <div>
              <input
                class="w-full"
                type="text"
                onInput={(e) =>
                  setFormData({
                    ...formData,
                    altPrimary: e.target.value,
                  })
                }
              />
            </div>
          )}
          <hr class="my-6" />
          <Body
            activePrimary={formData?.musclesWorked || []}
            activeSecondary={formData?.secondaryMusclesWorked || []}
          />
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
            <MuscleGroupsCheckList
              groups={primaryGroupOptions}
              formData={formData}
              setFormData={setFormData}
              formKey="musclesWorked"
            />
          </Accordion>

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
            <MuscleGroupsCheckList
              groups={primaryGroupOptions}
              formData={formData}
              setFormData={setFormData}
              formKey="secondaryMusclesWorked"
            />
          </Accordion>
        </div>
      )}
      <div class="py-3">
        <button
          class="text-sm btn secondary capitalize"
          onClick={() => setNewMuscleGroupModalIsOpen(true)}
        >
          Add muscle group
        </button>
      </div>

      <div class="py-4">
        <p class="mb-4">Bar weight: </p>
        <Counters
          value={formData.barWeight}
          setValue={(val) => {
            setFormData({
              ...formData,
              barWeight: val,
            })
          }}
          roundToFive
          jumpBy={5}
        />
      </div>

      <div class="pt-4">
        <button class="primary w-full" disabled={!formIsValid} onClick={submit}>
          Save
        </button>
      </div>
      {newMuscleGroupModalIsOpen && (
        <Modal
          isOpen={newMuscleGroupModalIsOpen}
          onRequestClose={() => setNewMuscleGroupModalIsOpen(false)}
        >
          <NewMuscleGroupForm
            onSubmit={() => {
              getData()
              setNewMuscleGroupModalIsOpen()
            }}
          />
        </Modal>
      )}
    </div>
  )
}

export default ExerciseForm
