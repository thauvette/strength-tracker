import { h } from "preact"
import { useState } from "preact/hooks"

// TODO: fix slight delay before re-order complete

const DraggableList = ({ items = [], onReorderEnd, renderItem }) => {
  const [draggingIndex, setDraggingIndex] = useState(null)
  const [targetIndex, setTargetIndex] = useState(null)

  const [order, setOrder] = useState(
    Array.from({ length: items.length }, (_, i) => i)
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
}) => {
  return (
    <li
      draggable="true"
      onDragStart={handleDragging}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      class={`py-2 border-b-4 ${isTarget ? "pt-10" : ""}`}
    >
      {children}
    </li>
  )
}

export default DraggableList
