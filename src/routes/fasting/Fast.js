import { h } from 'preact'
import dayjs from 'dayjs'
const duration = require('dayjs/plugin/duration')
dayjs.extend(duration)

import useDB from '../../context/db/db'
import { objectStores } from '../../context/db/config'
import { useEffect, useState } from 'preact/hooks'

import Icon from '../../components/icon/Icon'
import AnimateHeight from 'react-animate-height'
import dateFormats from '../../config/dateFormats'
import EditFastForm from './EditFastForm'

const printDiff = (data, now) => {
  const end = data.end || now
  const duration = dayjs.duration(dayjs(end).diff(data.start))
  return duration.format('HH:mm:ss')
}

const Fast = ({ id, data, onEdit }) => {
  const { updateEntry, deleteEntry } = useDB()
  const [now, setNow] = useState(new Date().getTime())
  const [editState, setEditState] = useState({
    formName: '',
    isOpen: false,
  })

  // if the fast is ongoing we'll show the count
  useEffect(() => {
    let timer
    if (!data.end) {
      timer = setInterval(() => {
        setNow(new Date().getTime())
      }, 1000)
    }
    return () => {
      if (timer) {
        clearInterval(timer)
      }
    }
  }, [now, data.end])

  const updateEnd = (end) => {
    updateEntry(objectStores.fasting, +id, {
      end,
    }).then((res) => {
      if (onEdit) {
        onEdit(res)
      }
    })
  }

  const end = () => {
    updateEnd(new Date().getTime())
  }

  const remove = () => {
    deleteEntry(objectStores.fasting, +id).then(() => {
      if (onEdit) {
        onEdit()
      }
    })
  }

  const toggleEditOpen = (formName) => {
    setEditState({
      formName,
      isOpen: !editState.isOpen,
    })
  }
  const handleEditForm = (values) => {
    updateEntry(objectStores.fasting, +id, {
      ...values,
    }).then((res) => {
      if (onEdit) {
        onEdit(res)
      }
      toggleEditOpen('edit')
    })
  }
  return (
    <div key={id} class={`p-2 mx-2 mb-4 rounded-md bg-white`}>
      <div>
        <div class="flex justify-between items-center">
          <p class="text-sm">
            {dayjs(data.start).format('MMM DD hh:mm a')}
            {data.end ? ` to ${dayjs(data.end).format('MMM DD hh:mm a')}` : ''}
          </p>
          {!data.end && (
            <button class="text-sm pb-0" onClick={end}>
              Stop
            </button>
          )}
        </div>
        <p class="flex-1 text-lg font-bold ">{printDiff(data, now)}</p>
      </div>
      <div class="flex justify-end">
        <button onClick={() => toggleEditOpen('edit')}>
          <Icon name="clipboard-outline" />
        </button>
        <button
          onClick={() => {
            toggleEditOpen('delete')
          }}
        >
          <Icon name="trash-outline" />
        </button>
      </div>
      <AnimateHeight height={editState.isOpen ? 'auto' : 0}>
        <div class="border-t py-2">
          {editState.formName === 'delete' && (
            <div>
              <p>Are you sure, this can not be undone</p>
              <button
                class="bg-gray-200 mr-2"
                onClick={() => toggleEditOpen('delete')}
              >
                Newp, Keep it
              </button>
              <button
                class="bg-red-900 text-white"
                onClick={() => {
                  remove()
                }}
              >
                Yup, ditch it
              </button>
            </div>
          )}

          {editState.formName === 'edit' && (
            <EditFastForm
              initialValues={{
                startDate: dayjs(data.start).format(dateFormats.day),
                startTime: dayjs(data.start).format(dateFormats.time),
                endDate: data.end
                  ? dayjs(data.end).format(dateFormats.day)
                  : '',
                endTime: data.end
                  ? dayjs(data.end).format(dateFormats.time)
                  : '',
              }}
              handleSubmit={handleEditForm}
            />
          )}
        </div>
      </AnimateHeight>
    </div>
  )
}

export default Fast
