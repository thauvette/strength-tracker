import { h } from "preact"
import Counters from "../counters/Counters"

const PlateControls = ({ weight, setWeight, barWeight, setBarWeight }) => (
  <div class="flex pb-12">
    <div class="flex-1 pr-2">
      <p class="text-center">Bar Weight:</p>
      <Counters
        value={barWeight}
        setValue={setBarWeight}
        jumpBy={5}
        roundToFive
      />
    </div>

    <div class="flex-1 pl-2">
      <p class="text-center">Total Weight:</p>
      <Counters value={weight} setValue={setWeight} jumpBy={5} roundToFive />
    </div>
  </div>
)

export default PlateControls
