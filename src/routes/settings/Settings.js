import { h } from "preact"
import Counters from "../../components/counters/Counters"
import useWeightSettings from "../../hooks/useWeightSettings"
import Modal from "../../components/modal/Modal"
import { useState } from "preact/hooks"
import NewPlateForm from "./NewPlateForm"

const Settings = () => {
  const {
    updateBarWeight,
    togglePlateAvailability,
    updatePlateCount,
    barWeight,
    availablePlates,
    addPlate,
  } = useWeightSettings()
  const [newPlateModalIsOpen, setNewPlateModalIsOpen] = useState(false)
  return (
    <div className="px-2">
      <h1>Settings</h1>
      <div class="py-4 border-b-4 ">
        <p class="mb-4">Default Bar Weight</p>
        <div className="max-w-xs ">
          <Counters
            value={+barWeight}
            setValue={updateBarWeight}
            jumpBy={5}
            roundToFive
          />
        </div>
      </div>
      <div class="py-4 border-b-4 ">
        <p class="mb-4">Available Plates</p>
        <div class="flex items-center justify-between py-2 border-b-2">
          <p>Plate</p>
          <p class="pr-12">Count</p>
        </div>
        {availablePlates?.map((plate, index) => {
          const id = `plate-${plate.weight}`
          const handlePlateCount = count => {
            updatePlateCount({
              index,
              count,
            })
          }
          return (
            <div
              key={index}
              class="flex items-center justify-between py-2 border-b-2"
            >
              <label htmlFor={id} class="flex items-center">
                <input
                  id={id}
                  type="checkbox"
                  onInput={() => togglePlateAvailability(index)}
                  checked={plate.available}
                />
                <p class="mx-2">{plate.weight}'s</p>
              </label>
              <Counters
                value={plate.count}
                setValue={handlePlateCount}
                jumpBy={1}
              />
            </div>
          )
        })}
        <div class="pt-4">
          <button
            class="bg-blue-900 text-white"
            onClick={() => setNewPlateModalIsOpen(true)}
          >
            Add Plate
          </button>
        </div>
      </div>
      <Modal
        isOpen={newPlateModalIsOpen}
        onRequestClose={() => setNewPlateModalIsOpen(false)}
      >
        <NewPlateForm
          onSubmit={data => {
            addPlate(data)
            setNewPlateModalIsOpen(false)
          }}
        />
      </Modal>
    </div>
  )
}

export default Settings
