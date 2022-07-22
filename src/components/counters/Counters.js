import { h } from "preact"

const Counters = ({ value, setValue, roundToFive, jumpBy }) => (
  <div class="flex items-center">
    <button
      disabled={value <= 0}
      onClick={() => {
        const remainder = roundToFive ? +value % jumpBy : 0
        setValue(+value > jumpBy ? +value - (remainder || jumpBy) : 0)
      }}
    >
      -
    </button>

    <input
      class="flex-1 w-20 text-center"
      value={+value}
      onInput={e => setValue(+e.target.value)}
    />

    <button
      onClick={() => {
        const remainder = roundToFive ? +value % jumpBy : 0
        setValue(+value + jumpBy - remainder)
      }}
    >
      +
    </button>
  </div>
)

export default Counters
