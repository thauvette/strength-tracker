import { h } from "preact"
import { useState } from "preact/hooks"

export default function AdditionalExerciseForm({
  onSubmit,
  onEdit,
  initialValues,
}) {
  const [exerciseInfo, setExercisesInfo] = useState(
    initialValues || {
      exercise: "",
      sets: "",
      reps: "",
      weight: "",
    }
  )

  function handleInput(e) {
    setExercisesInfo({
      ...exerciseInfo,
      [e.target.name]: e.target.value,
    })
  }
  function submit() {
    const number =
      +exerciseInfo?.sets && exerciseInfo?.sets > 0 ? exerciseInfo?.sets : 1

    let i = 0
    const asArray = []
    while (i < number) {
      asArray.push({
        ...exerciseInfo,
        isAux: true,
        text: `${exerciseInfo.reps} @ ${exerciseInfo.weight}`,
      })
      i++
    }

    onSubmit(asArray)
  }
  return (
    <div>
      {Object.keys(exerciseInfo).map(key => (
        <div key={key}>
          <input onInput={handleInput} name={key} placeholder={key} />
        </div>
      ))}
      <button onClick={submit}>Add</button>
    </div>
  )
}
