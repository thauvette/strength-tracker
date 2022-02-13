import { h } from "preact"
import EditableSet from "./editableSet"

export default function AdditionalExercisesList({
  additionalExercises,
  onEdit,
}) {
  return (
    <div>
      <p>Aux work:</p>
      {additionalExercises.map((additionalLift, index) => (
        <EditableSet
          key={`extra-${index}`}
          lift={additionalLift}
          handleChange={lift =>
            onEdit({
              index,
              lift,
            })
          }
          handleRemove={() =>
            handleAuxExerciseRemove({
              week: key,
              mainLift: name,
              index,
            })
          }
        />
      ))}
    </div>
  )
}
