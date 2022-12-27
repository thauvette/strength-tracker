import { h } from 'preact'
import { useState } from 'preact/hooks'
import generateRandomId from '../../utilities.js/generateRandomId'

const CreateRoutine = () => {
  const [days, setDays] = useState([
    {
      name: 'Day 1',
      id: generateRandomId(),
      sets: [],
    },
  ])

  const addDay = () => {
    const number = days?.length + 1
    setDays([
      ...days,
      {
        name: `Day ${number}`,
        id: generateRandomId(),
        sets: [],
      },
    ])
  }
  const updateDayName = (id, value) => {
    setDays(
      days.map((day) =>
        id === day.id
          ? {
              ...day,
              name: value,
            }
          : day,
      ),
    )
  }
  const removeDay = (id) => setDays(days.filter((day) => day.id !== id))
  return (
    <div class="px-4">
      <h1>New Routine</h1>
      <div>
        <input type="text" name="name" placeholder="Name" />
        {days.map((day) => {
          return (
            <div key={day.id}>
              <div class="flex justify-between">
                <input
                  type="text"
                  value={day.name || ''}
                  onInput={(e) => updateDayName(day.id, e.target.value)}
                />
                <button onClick={() => removeDay(day.id)}>x</button>
              </div>
            </div>
          )
        })}
        <button onClick={addDay}>Add a day</button>
      </div>
    </div>
  )
}

export default CreateRoutine
