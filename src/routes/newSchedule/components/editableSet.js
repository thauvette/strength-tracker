import { h } from "preact"

export default function EditableSet({ lift, handleChange, handleRemove }) {
  return (
    <div class="flex py-2 w-full">
      <div class="flex-shrink-0 flex flex-grow">
        <p class="m-0">{lift.exercise}</p>
        <div class="flex-shrink">
          <input
            value={lift.reps}
            onInput={e => handleChange({ ...lift, reps: e.target.value })}
          />
        </div>
        <p class="m-0">@</p>
        <div class="flex-shrink">
          <input
            value={lift.weight}
            onInput={e => handleChange({ ...lift, weight: e.target.value })}
          />
        </div>
      </div>
      <button onClick={handleRemove}>X</button>
    </div>
  )
}
