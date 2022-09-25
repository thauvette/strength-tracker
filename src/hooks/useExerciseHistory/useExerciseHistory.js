import { useState, useEffect } from 'preact/hooks'
import useDB from '../../context/db/db'

import { formatHistory, formatPrs } from './utils'

const useExerciseHistory = (id) => {
  const { getExerciseHistoryById } = useDB()
  const [exerciseHistory, setExerciseHistory] = useState(null)

  const getData = () =>
    id
      ? getExerciseHistoryById(id)
          .then((res) => {
            const formattedHistory = formatHistory(res?.items)
            setExerciseHistory({
              ...res,
              items: formattedHistory.items,
              eorm: formattedHistory.eorm,
              raw: res.items,
              prs: formatPrs(res?.items),
            })
          })
          .catch((err) => {
            console.log(err)
          })
      : null

  useEffect(() => {
    getData()
  }, [id]) // eslint-disable-line
  return [exerciseHistory, getData]
}

export default useExerciseHistory
