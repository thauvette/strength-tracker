import { useState, useEffect } from 'preact/hooks'
import useDB from '../../context/db/db'

import { formatHistory } from './utils'

const useExerciseHistory = (id) => {
  const { getExerciseHistoryById } = useDB()
  const [exerciseHistory, setExerciseHistory] = useState(null)

  const getData = () =>
    id
      ? getExerciseHistoryById(id)
          .then((res) => {
            const formattedHistory = formatHistory({
              items: res?.items,
              includeBwInHistory: res.type === 'bwr',
            })
            setExerciseHistory({
              ...res,
              items: formattedHistory.items,
              eorm: formattedHistory.eorm,
              raw: res.items,
              prs: formattedHistory.prs,
              prsWithBW: formattedHistory.prsWithBW,
              id,
            })
          })
          .catch((err) => {
            console.log(err)
            throw err
          })
      : null

  useEffect(() => {
    getData()
  }, [id]) // eslint-disable-line

  return [exerciseHistory, getData]
}

export default useExerciseHistory
