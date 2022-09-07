import { h } from "preact"
import { useState } from "preact/hooks"

// TODO: fix slight delay before re-order complete
// TODO: clone element being dragged

const DraggableList = ({
  items = [],
  onReorderEnd,
  renderItem,
  initialOrder,
}) => {
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [targetIndex, setTargetIndex] = useState(null)

  const [order, setOrder] = useState(
    initialOrder || Array.from({ length: items.length }, (_, i) => i)
  )

  const handleDragEnd = () => {
    const currentOrder = [...order]
    currentOrder[currentOrder.indexOf(draggingIndex)] = undefined
    currentOrder.splice(currentOrder.indexOf(targetIndex), 0, draggingIndex)
    const newOrder = currentOrder.filter(num => num !== undefined)
    setDraggingIndex(null)
    setTargetIndex(null)
    setOrder(newOrder)
    onReorderEnd(newOrder)
  }

  const deleteItem = target => {
    const index = order.indexOf(target)
    const cloned = [...order]
    cloned.splice(index, 1)
    setOrder(cloned)
    onReorderEnd(cloned)
  }
  return (
    <ul>
      {order.map(setIndex => {
        const item = items[setIndex]
        return (
          <Item
            key={setIndex}
            text={item?.label}
            handleDragging={() => setDraggingIndex(setIndex)}
            handleDragOver={() => setTargetIndex(setIndex)}
            handleDragEnd={handleDragEnd}
            isTarget={targetIndex === setIndex}
            handleRemove={() => deleteItem(setIndex)}
          >
            {renderItem({
              setIndex,
            })}
          </Item>
        )
      })}
    </ul>
  )
}

const Item = ({
  handleDragging,
  handleDragOver,
  handleDragEnd,
  children,
  isTarget,
  handleRemove,
}) => {
  return (
    <li class={`py-2 border-b-4 ${isTarget ? "pt-10" : ""}`}>
      <div class="flex justify-between" onDragOver={handleDragOver}>
        <div class="flex items-center">
          <div
            draggable="true"
            onDragStart={handleDragging}
            onDragEnd={handleDragEnd}
            class="pr-2 font-xl flex items-center"
          >
            <ion-icon name="reorder-two-outline" />
          </div>
          {children}
        </div>
        <button class="text-2xl" onClick={handleRemove} ariaLabel="remove set">
          <ion-icon name="close-circle-outline" />
        </button>
      </div>
    </li>
  )
}

export default DraggableList
