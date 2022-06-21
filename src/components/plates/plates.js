import { h } from "preact"
import { useState } from "preact/hooks"
import calculatePlates from "./calculatePlates"
import PlateControls from "./plateControls"
import renderPlateClass from "./renderPlateClass"

const Plates = ({
  weight: initialWeight,
  barWeight: initialBarWeight = 45,
}) => {
  const [weight, setWeight] = useState(initialWeight)
  const [barWeight, setBarWeight] = useState(initialBarWeight)

  const { plates: neededPlates } = calculatePlates({
    targetWeight: +weight || 0,
    barWeight,
  })

  const showBar = weight >= barWeight

  return (
    <div>
      <h1 class="mb-4">Plates</h1>
      <PlateControls
        weight={weight}
        setWeight={setWeight}
        barWeight={barWeight}
        setBarWeight={setBarWeight}
      />
      <div class="flex items-center px-2 h-24">
        <div class="flex items-center flex-row-reverse">
          {neededPlates.map((plate, i) => (
            <div
              key={i}
              class={`${renderPlateClass(plate)} ${
                i + 1 < neededPlates.length ? "border-r border-gray-100" : ""
              } rounded-sm`}
            />
          ))}
        </div>
        {showBar && <div class="h-2 flex-grow bg-gray-300" />}

        <div class="flex items-center">
          {neededPlates.map((plate, i) => (
            <div
              key={i}
              class={`${renderPlateClass(plate)} ${
                i + 1 < neededPlates.length ? "border-r border-gray-100" : ""
              } rounded-sm`}
            />
          ))}
        </div>
      </div>
      <div class="py-4">
        {showBar ? <p class="text-center">Bar + </p> : null}
        <p class="text-center">
          {neededPlates?.length ? `${neededPlates.join(", ")} per side` : ""}
        </p>
      </div>
    </div>
  )
}

export default Plates
