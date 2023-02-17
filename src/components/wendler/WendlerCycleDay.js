import { h } from 'preact'
import { useState } from 'preact/hooks'
import Icon from '../icon/Icon'

const WendlerCycleDay = ({
  runningSets,
  mainSets,
  auxSets,
  additionalSets,
  mainExercise,
  auxName,
}) => {
  const [viewInRunningOrder, setViewInRunningOrder] = useState(false)

  return (
    <div>
      <label class="flex items-center">
        <input
          defaultChecked={viewInRunningOrder}
          type="checkbox"
          onInput={(e) => setViewInRunningOrder(e.target.checked)}
        />
        <p class="ml-2">View in running order</p>
      </label>
      {viewInRunningOrder ? (
        runningSets.map((set) => (
          <div key={set.wendlerId} class="flex gap-2 items-center pb-2">
            {set?.completed ? (
              <Icon name="checkmark-outline" width="24" />
            ) : null}
            <p>
              {set.exercise} {set.reps} @ {set.weight}
            </p>
          </div>
        ))
      ) : (
        <>
          <p class="uppercase">Main set: {mainExercise}</p>
          <div>
            {mainSets?.length > 0 &&
              mainSets.map((set, i) => {
                const { reps, weight, completed } = set

                return (
                  <div key={i} class="flex gap-2 items-center">
                    {completed ? (
                      <Icon name="checkmark-outline" width="24" />
                    ) : null}
                    <p>
                      {reps} @ {weight}
                    </p>
                  </div>
                )
              })}
          </div>
          <div class="py-4">
            {auxSets?.length > 0 && (
              <>
                <p className="uppercase">Aux: {auxName}</p>
                {auxSets.map((set, i) => {
                  const { reps, weight, completed } = set

                  return (
                    <div key={i}>
                      <p>
                        {completed ? '✔️' : ''} {reps} @ {weight}
                      </p>
                    </div>
                  )
                })}
              </>
            )}
          </div>
          {!!additionalSets?.length && (
            <div>
              <p className="uppercase">Additional </p>
              {additionalSets.map((set, i) => {
                const { reps, weight, completed } = set
                return (
                  <div key={i}>
                    <p>
                      {completed ? '✔️' : ''} {set.exercise} {reps} @ {weight}
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default WendlerCycleDay
