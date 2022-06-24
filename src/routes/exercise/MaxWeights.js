import { h } from "preact"
import dayjs from "dayjs"

const MaxWeights = ({ exerciseHistory }) => (
  <div class="px-2">
    {exerciseHistory?.prs?.length ? (
      exerciseHistory?.prs.map(set => (
        <div
          key={set.reps}
          class={`flex items-center justify-between py-4 border-b-4 ${
            set.isActualSet ? "font-bold" : "opacity-90"
          }`}
        >
          <p>
            {set.reps} @ {set.displayWeight}
          </p>
          <p>{dayjs(set.created).format("DD MMM YYYY")}</p>
        </div>
      ))
    ) : (
      <p>No prs</p>
    )}
  </div>
)

export default MaxWeights
