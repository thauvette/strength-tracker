import dayjs from "dayjs"
import { h } from "preact"
import SetRow from "../../components/setRow/setRow"

const ExerciseHistory = ({ exerciseHistory, onChangeSet }) => (
  <>
    {exerciseHistory?.items &&
    Object.keys(exerciseHistory?.items)?.length > 0 ? (
      Object.entries(exerciseHistory.items)
        .sort(([aKey], [bKey]) => (dayjs(aKey).isAfter(bKey) ? -1 : 1))
        .map(([dayKey, items]) => (
          <div key={dayKey} class="pb-4">
            <div class="border-b-2 pb-1 ">
              <p class="font-medium">{dayjs(dayKey).format("MMM DD, YYYY")}</p>
            </div>
            <div class="py-2">
              {items.map(item => (
                <div key={item.created}>
                  <div
                    class={`
                        ${
                          exerciseHistory?.eorm?.time === item.created
                            ? "bg-blue-200"
                            : ""
                        }
                        `}
                  >
                    <SetRow set={item} onChangeSet={onChangeSet} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
    ) : (
      <p>No history found</p>
    )}
  </>
)

export default ExerciseHistory
