import dayjs from "dayjs"
import { h } from "preact"
import calculateOneRepMax from "../../utilities.js/calculateOneRepMax"

const ExerciseHistory = ({ exerciseHistory }) => (
  <>
    {exerciseHistory?.items &&
    Object.keys(exerciseHistory?.items)?.length > 0 ? (
      Object.entries(exerciseHistory.items)
        .sort(([aKey], [bKey]) => (dayjs(aKey).isAfter(bKey) ? -1 : 1))
        .map(([dayKey, items]) => {
          return (
            <div key={dayKey} class="pb-4">
              <div class="border-b-2 pb-1 ">
                <p class="font-medium">
                  {dayjs(dayKey).format("MMM DD, YYYY")}
                </p>
              </div>
              <div class="py-2">
                {items.map(item => (
                  <div
                    key={item.created}
                    class={`flex justify-between py-2 items-center
                      ${
                        exerciseHistory?.eorm?.time === item.created
                          ? "bg-blue-200"
                          : ""
                      }
                      `}
                  >
                    <p class="font-medium">
                      {item.reps} @ {item.weight}
                    </p>
                    <p>{calculateOneRepMax({ ...item })}</p>
                  </div>
                ))}
              </div>
            </div>
          )
        })
    ) : (
      <p>No history found</p>
    )}
  </>
)

export default ExerciseHistory
