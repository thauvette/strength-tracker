import { h } from "preact"
import { useState } from "preact/hooks"
import Counters from "../../components/counters/Counters"

const NewPlateForm = ({ onSubmit }) => {
  const [weight, setWeight] = useState(0)
  const [count, setCount] = useState(10)

  const submit = () => {
    onSubmit({
      weight,
      count,
    })
  }

  return (
    <div>
      <div class="pb-4">
        <p>Weight: </p>
        <Counters value={weight} setValue={setWeight} jumpBy={5} roundToFive />
      </div>
      <div class="pb-4">
        <p>Count:</p>
        <Counters value={count} setValue={setCount} jumpBy={1} />
      </div>
      <button class="bg-blue-900 text-white" onClick={submit}>
        Add
      </button>
    </div>
  )
}

export default NewPlateForm
