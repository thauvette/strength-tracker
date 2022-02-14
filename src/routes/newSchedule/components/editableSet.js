import { h } from "preact"

export default function EditableSet({ lift, handleChange, handleRemove }) {
  return (
    <div class="flex items-center">
      <p class="mb-0 mr-2">{lift.exercise}</p>
      <input
        class="w-0 flex-1"
        value={lift.reps}
        onInput={e => handleChange({ ...lift, reps: e.target.value })}
      />
      <p class="mb-0 mx-2">@</p>
      <input
        class="w-0 flex-1"
        value={lift.weight}
        onInput={e => handleChange({ ...lift, weight: e.target.value })}
      />
      <button onClick={handleRemove}>X</button>
    </div>
  )
}
