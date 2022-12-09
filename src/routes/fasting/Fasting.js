import dayjs from 'dayjs'
import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { objectStores } from '../../context/db/config'
import useDB from '../../context/db/db'
import Fast from './Fast'

const Fasting = () => {
  const [list, setList] = useState({})
  const { getAllEntries, createEntry } = useDB()

  const getItems = () => {
    getAllEntries(objectStores.fasting).then((res) => {
      setList(res)
    })
  }

  useEffect(() => {
    getItems()
  }, []) // eslint-disable-line

  const create = () => {
    createEntry(objectStores.fasting, {
      start: new Date().getTime(),
    }).then((res) => {
      setList({ ...list, [res.id]: res })
    })
  }
  const items = Object.entries(list)
    .map(([id, data]) => ({
      ...data,
      id,
    }))
    .sort((a, b) => (dayjs(a.start).isBefore(dayjs(b.start)) ? 1 : -1))
  return (
    <div>
      <div class="flex justify-between px-2 pb-4 mb-4 border-b-2">
        <h1>Fasting</h1>
        <button onClick={create} class="text-blue text-sm py-1 px-1">
          New +
        </button>
      </div>
      {items.length ? (
        items.map((item) => {
          return (
            <Fast key={item.id} id={item.id} data={item} onEdit={getItems} />
          )
        })
      ) : (
        <p>No fasts recorded</p>
      )}
    </div>
  )
}

export default Fasting
