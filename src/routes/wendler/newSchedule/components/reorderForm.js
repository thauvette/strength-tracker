import { h } from "preact"
import { useState } from "preact/hooks"
import DraggableList from "../../../../components/draggableList/DraggableList"

const ReorderForm = ({ items = [], onSave, allowEditAllWeeks }) => {
  const [order, setOrder] = useState(null)
  const [updateAllWeeks, setUpdateAllWeeks] = useState(allowEditAllWeeks)

  const submit = () => {
    onSave({ newOrder: order, updateAllWeeks })
  }

  return (
    <div>
      <p>Drag and drop to re-order day</p>
      <div>
        <label class="flex items-center">
          <input
            type="checkbox"
            onInput={e => setUpdateAllWeeks(e.target.checked)}
            checked={updateAllWeeks}
            disabled={!allowEditAllWeeks}
          />
          <p class="m-0 ml-2 text-lg">Update all weeks?</p>
          {!allowEditAllWeeks && (
            <p>Unable to update all weeks, seems there are different sets.</p>
          )}
        </label>
      </div>
      <DraggableList
        items={items}
        onReorderEnd={newOrder => {
          setOrder(newOrder)
        }}
        renderItem={({ setIndex }) => {
          return <p>{items[setIndex]?.label}</p>
        }}
      />
      <div>
        <button onClick={submit}>Save</button>
      </div>
    </div>
  )
}

export default ReorderForm
