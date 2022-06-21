import { h } from "preact"

const PlateControls = ({ weight, setWeight, barWeight, setBarWeight }) => (
  <div class="flex pb-12">
    <div class="flex-1 pr-2">
      <p class="text-center">Bar Weight:</p>
      <div class="flex items-center">
        <button
          disabled={barWeight <= 0}
          onClick={() => {
            const remainder = +barWeight % 5
            setBarWeight(+barWeight > 5 ? +barWeight - (remainder || 5) : 0)
          }}
        >
          -
        </button>

        <input
          class="flex-1 w-20 text-center"
          value={+barWeight}
          onInput={e => setBarWeight(+e.target.value)}
        />

        <button
          onClick={() => {
            setBarWeight(+barWeight + 5 - (+barWeight % 5))
          }}
        >
          +
        </button>
      </div>
    </div>

    <div class="flex-1 pl-2">
      <p class="text-center">Total Weight:</p>
      <div class="flex items-center ">
        <button
          disabled={weight <= 0}
          onClick={() => {
            const remainder = +weight % 5
            setWeight(+weight > 5 ? +weight - (remainder || 5) : 0)
          }}
        >
          -
        </button>

        <input
          class="flex-1 text-center w-20"
          value={+weight}
          onInput={e => setWeight(+e.target.value)}
        />

        <button
          onClick={() => {
            setWeight(+weight + 5 - (+weight % 5))
          }}
        >
          +
        </button>
      </div>
    </div>
  </div>
)

export default PlateControls
