import { h } from 'preact'
import { useState } from 'preact/hooks'
import DraggableList from '../../../../components/draggableList/DraggableList'

const ReorderForm = ({
  items = [],
  onSave,
  allowEditAllWeeks,
  hideAllWeeksCheckbox,
}) => {
  const [order, setOrder] = useState(
    Array.from({ length: items.length }, (_, i) => i),
  )
  const [updateAllWeeks, setUpdateAllWeeks] = useState(allowEditAllWeeks)

  const submit = () => {
    onSave({ newOrder: order, updateAllWeeks })
  }

  return (
    <div>
      {!hideAllWeeksCheckbox && (
        <label class="flex items-center">
          <input
            type="checkbox"
            onInput={(e) => setUpdateAllWeeks(e.target.checked)}
            checked={updateAllWeeks}
            disabled={!allowEditAllWeeks}
          />
          <p class="m-0 ml-2 text-lg">Update all weeks?</p>
          {!allowEditAllWeeks && (
            <p>Unable to update all weeks, seems there are different sets.</p>
          )}
        </label>
      )}

      <DraggableList
        items={items}
        onReorderEnd={(newOrder) => {
          setOrder(newOrder)
        }}
        renderItem={({ setIndex }) => <p>{items[setIndex]?.label}</p>}
        initialOrder={order}
      />

      <div class="flex pt-4">
        <button class="w-full bg-primary-900 text-white" onClick={submit}>
          Save
        </button>
      </div>
    </div>
  )
}

export default ReorderForm
