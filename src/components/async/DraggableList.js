import { h } from 'preact';
import { useEffect, useReducer, useRef, useState } from 'preact/hooks';
import Icon from '../icon/Icon';

const initialDragState = {
  draggingIndex: null,
  targetIndex: null,
};

const dragReducer = (state = { ...initialDragState }, action) => {
  switch (action.type) {
    case 'SET_DRAG_INDEX':
      return {
        ...state,
        draggingIndex: action.payload,
      };
    case 'SET_TARGET_INDEX':
      return {
        ...state,
        targetIndex: action.payload,
      };
    case 'END_DRAG':
      return {
        ...initialDragState,
      };
    default:
      return state;
  }
};

const DraggableList = ({
  items = [],
  onReorderEnd,
  renderItem,
  initialOrder,
}) => {
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (!document.getElementById('DragDropTouch')) {
        // add drag and drop polyfill
        const script = document.createElement('script');
        script.src =
          'https://bernardo-castilho.github.io/DragDropTouch/DragDropTouch.js';
        script.id = 'DragDropTouch';
        document.body.appendChild(script);
      }
    }
  }, []);
  const ghostRef = useRef(null);
  const [dragState, dispatchDragState] = useReducer(dragReducer, {
    ...initialDragState,
  });
  const { draggingIndex, targetIndex } = dragState;
  const [order, setOrder] = useState(
    initialOrder || Array.from({ length: items.length }, (_, i) => i),
  );
  const handleDragEnd = () => {
    const currentOrder = [...order];
    currentOrder[currentOrder.indexOf(draggingIndex)] = undefined;
    currentOrder.splice(currentOrder.indexOf(targetIndex), 0, draggingIndex);
    const newOrder = currentOrder.filter((num) => num !== undefined);
    dispatchDragState({ type: 'END_DRAG' });
    setOrder(newOrder);
    onReorderEnd(newOrder);
    ghostRef.current.innerHTML = '';
    ghostRef.current.style.display = 'none';
    ghostRef.current.style.opacity = '0';
  };

  const deleteItem = (target) => {
    const index = order.indexOf(target);
    const cloned = [...order];
    cloned.splice(index, 1);
    setOrder(cloned);
    onReorderEnd(cloned);
  };

  return (
    <>
      <ul>
        {order.map((setIndex) => {
          const item = items[setIndex];
          return (
            <Item
              key={setIndex}
              text={item?.label}
              handleDragging={(e, content) => {
                if (ghostRef?.current) {
                  ghostRef.current.style.display = 'block';
                  ghostRef.current.style.opacity = '1';
                  ghostRef.current.innerHTML = content;
                  e.dataTransfer.setDragImage(ghostRef.current, 0, 0);
                }
                dispatchDragState({
                  type: 'SET_DRAG_INDEX',
                  payload: setIndex,
                });
              }}
              handleDragOver={() => {
                dispatchDragState({
                  type: 'SET_TARGET_INDEX',
                  payload: setIndex,
                });
              }}
              handleDragEnd={handleDragEnd}
              isTarget={targetIndex === setIndex}
              handleRemove={() => deleteItem(setIndex)}
              isDragging={draggingIndex === setIndex}
            >
              {renderItem({
                setIndex,
              })}
            </Item>
          );
        })}
      </ul>
      <div
        ref={ghostRef}
        class="fixed w-full bg-blue-100 px-4 py-2 shadow-lg"
        style={{
          display: 'none',
          top: '2000px',
        }}
      />
    </>
  );
};

const Item = ({
  handleDragging,
  handleDragOver,
  handleDragEnd,
  children,
  isTarget,
  handleRemove,
  isDragging,
}) => {
  const ref = useRef(null);
  return (
    <li
      ref={ref}
      class={`py-2 border-b-4 ${isDragging ? 'opacity-50' : ''} `}
      onDragOver={handleDragOver}
    >
      <div class={'flex justify-between '}>
        <div class={`flex items-center ${isTarget ? 'pt-10' : ''}`}>
          <div
            draggable="true"
            onDragStart={(e) => {
              handleDragging(e, ref.current.innerHTML);
            }}
            onDragEnd={handleDragEnd}
            class="pr-2 font-xl flex items-center"
          >
            <Icon name="reorder-two-outline" />
          </div>
          {children}
        </div>
        <button class="text-2xl" onClick={handleRemove} ariaLabel="remove set">
          <Icon name="close-circle-outline" />
        </button>
      </div>
    </li>
  );
};

export default DraggableList;
