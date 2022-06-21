import { h } from "preact"
import { useState, useEffect } from "preact/hooks"
import dayjs from "dayjs"
import useDB from "../context/db"

const useExerciseHistory = id => {
  const { getExerciseHistoryById } = useDB()
  const [exerciseHistory, setExerciseHistory] = useState(null)

  const getData = () =>
    id
      ? getExerciseHistoryById(id)
          .then(res => {
            let eorm
            const formattedHistory = res?.items?.length
              ? res.items.reduce((obj, item) => {
                  const dayKey = dayjs(item.created).format("YYYY-MM-DD")
                  const items = obj?.[dayKey] || []
                  const estOneRepMax = (
                    +item.weight * +item.reps * 0.033 +
                    +item.weight
                  ).toFixed(2)
                  if (!eorm || eorm.max < +estOneRepMax) {
                    eorm = {
                      time: item.created,
                      day: dayKey,
                      max: +estOneRepMax,
                    }
                  }
                  items.push({
                    ...item,
                    estOneRepMax,
                  })
                  return {
                    ...obj,
                    [dayKey]: items,
                  }
                }, {})
              : {}

            setExerciseHistory({ ...res, items: formattedHistory, eorm })
          })
          .catch(err => {
            console.log(err)
          })
      : null

  useEffect(() => {
    getData()
  }, [id]) // eslint-disable-line
  return [exerciseHistory, getData]
}

export default useExerciseHistory
