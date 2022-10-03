import { h } from 'preact'
import { useState } from 'preact/compat'
import AnimateHeight from 'react-animate-height'

import SetRowDrawer from './setRowDrawer'
import useDB, { objectStores } from '../../context/db/db'
import Icon from '../icon/Icon'

const SetRow = ({ set, onChangeSet }) => {
  const { createOrUpdateLoggedSet, deleteEntry } = useDB()
  const updateExistingSet = async ({ weight, reps, id }) => {
    await createOrUpdateLoggedSet(id, {
      weight,
      reps,
    })
    if (onChangeSet) {
      onChangeSet()
    }
  }

  const deleteSet = async () => {
    await deleteEntry(objectStores.sets, set.id)
    if (onChangeSet) {
      onChangeSet()
    }
  }

  const [drawerState, setDrawerState] = useState({
    open: false,
    content: null, // one of note, edit, stats.
  })

  const closeDrawer = () => {
    setDrawerState({
      ...drawerState,
      open: false,
    })
    if (typeof window !== 'undefined') {
      window.setTimeout(() => {
        setDrawerState({
          open: false,
          content: null,
        })
      }, 300)
    }
  }

  const handleToggleDrawerContent = (contentType) => {
    if (drawerState.open && drawerState.content === contentType) {
      closeDrawer()
    } else {
      setDrawerState({
        open: true,
        content: contentType,
      })
    }
  }

  return (
    <div class="py-2 border-b-2 border-blue-200">
      <div class="flex items-center justify-between ">
        <button
          onClick={() => handleToggleDrawerContent('note')}
          ariaLabel="view notes"
        >
          <div class="flex items-center">
            <Icon name="clipboard-outline" />
          </div>
        </button>

        <p class="m-0 flex-1">
          {set.reps} @ {set.weight}
        </p>
        <div class="flex items-center">
          <button
            ariaLabel="view stats"
            onClick={() => handleToggleDrawerContent('stats')}
          >
            <div class="flex items-center">
              <Icon name="bar-chart-outline" />
            </div>
          </button>
          <button
            ariaLabel="delete set"
            onClick={() => handleToggleDrawerContent('delete')}
          >
            <div class="flex items-center">
              <Icon name="trash-outline" />
            </div>
          </button>
          <button
            onClick={() => handleToggleDrawerContent('edit')}
            ariaLabel="edit set"
          >
            <div class="flex items-center">
              <Icon name="create-outline" />
            </div>
          </button>
        </div>
      </div>
      <AnimateHeight height={drawerState.open ? 'auto' : 0} duration={250}>
        <div class="px-4">
          <SetRowDrawer
            set={set}
            drawerContent={drawerState.content}
            onChangeSet={() => {
              if (onChangeSet) {
                onChangeSet()
              }
              closeDrawer()
            }}
            closeDrawer={closeDrawer}
            handleUpdateSet={({ weight, reps, id }) => {
              updateExistingSet({
                weight,
                reps,
                id,
              })
              closeDrawer()
            }}
            handleDeleteSet={deleteSet}
          />
        </div>
      </AnimateHeight>
    </div>
  )
}

export default SetRow
