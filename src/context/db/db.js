import { useEffect, useState, createContext, useContext } from 'preact/compat'
import dayjs from 'dayjs'

import {
  getFromCursor as getFromCursorUtil,
  openObjectStoreTransaction as openObjectStoreTransactionUtil,
} from './utils/dbUtils'
import initializeDb from './initializeDb'
import { objectStores } from './config'
import {
  getWendlerExercises,
  updateWendlerItem,
  getWendlerCycle,
  createCycle,
} from './wendler'
import { createBioMetric } from './bioMetrics'
import { createEntry, deleteEntry, getAllEntries, updateEntry } from './entries'
import {
  createOrUpdateLoggedSet,
  deleteLoggedSet,
  getAllSetsHistory,
} from './sets'
import { createRoutine } from './routines'

const DBContext = createContext()

export const DBProvider = ({ children }) => {
  const [db, setDb] = useState(null)

  // INITIALIZE OUR DB
  useEffect(() => {
    initializeDb(setDb)
  }, []) // eslint-disable-line

  if (!db) {
    return null
  }

  const getFromCursor = (store) => getFromCursorUtil(db, store)

  const openObjectStoreTransaction = (store) =>
    openObjectStoreTransactionUtil(db, store)

  const getExerciseOptions = () =>
    new Promise((resolve) => {
      // need to get exercises and muscle groups and connect
      // then together.
      getFromCursor(objectStores.muscleGroups).then(
        async (muscleGroupsObject) => {
          const exercises = await getFromCursor(objectStores.exercises)

          const data = Object.entries(exercises || {}).reduce(
            (obj, [exerciseId, exercise]) => {
              const muscleGroupData = muscleGroupsObject[exercise.primaryGroup]
              const currentGroup = obj[exercise.primaryGroup] || {
                ...muscleGroupData,
                id: exercise.primaryGroup,
                items: [],
              }

              currentGroup.items.push({
                ...exercise,
                id: exerciseId,
              })

              return {
                ...obj,
                [exercise.primaryGroup]: currentGroup,
              }
            },
            {},
          )
          return resolve(data)
        },
      )
    })

  const getMuscleGroups = async () => {
    const groups = await getFromCursor(objectStores.muscleGroups)
    return Promise.resolve(
      Object.entries(groups || {}).reduce((obj, [id, group]) => {
        const primaryGroupId = group.isPrimary ? id : group.parentGroup

        let currentPrimaryData = obj[primaryGroupId] || {
          secondaryGroups: [],
        }

        if (group.isPrimary) {
          currentPrimaryData = {
            ...currentPrimaryData,
            ...group,
            id,
          }
        } else {
          const groupData = {
            ...group,
            id,
          }
          currentPrimaryData.secondaryGroups.push(groupData)
          obj[id] = groupData
        }
        obj[primaryGroupId] = currentPrimaryData
        return obj
      }, {}),
    )
  }

  const getExerciseById = (id) =>
    new Promise((resolve) => {
      const { objectStore } = openObjectStoreTransaction(objectStores.exercises)
      const keyRange = IDBKeyRange.only(+id)

      const cursorRequest = objectStore.openCursor(keyRange)
      cursorRequest.onsuccess = (event) => {
        resolve(event?.target?.result?.value)
      }
    })

  const getExerciseHistoryById = (id) =>
    new Promise((resolve) => {
      getExerciseById(id).then(async (exerciseResponse) => {
        const muscleGroupData = await getFromCursor(objectStores.muscleGroups)

        const primaryMuscles = []
        const secondaryMusclesWorked = []

        if (exerciseResponse?.musclesWorked?.length) {
          exerciseResponse.musclesWorked.forEach((muscleId) => {
            primaryMuscles.push({
              ...muscleGroupData[muscleId],
              id: muscleId,
            })
          })
        }
        if (exerciseResponse?.secondaryMusclesWorked?.length) {
          exerciseResponse.secondaryMusclesWorked.forEach((muscleId) => {
            secondaryMusclesWorked.push({
              ...muscleGroupData[muscleId],
              id: muscleId,
            })
          })
        }
        const { objectStore } = openObjectStoreTransaction(objectStores.sets)
        // get all sets for this exercise
        const index = objectStore.index('exercise')
        const keyRange = IDBKeyRange.only(+id)
        const cursorRequest = index.openCursor(keyRange)

        const results = []

        cursorRequest.onsuccess = function (event) {
          const data = event?.target?.result?.value
          if (data) {
            results.push({ ...data, id: event?.target?.result?.primaryKey })
            event?.target?.result.continue()
          } else {
            resolve({
              ...exerciseResponse,
              primaryGroupData:
                muscleGroupData?.[exerciseResponse?.primaryGroup],
              musclesWorked: primaryMuscles,
              secondaryMusclesWorked,
              items: results,
            })
          }
        }
      })
    })

  async function generateBackupData() {
    const arr = []
    const headerItems = ['store', 'id']

    for (const storeName of Array.from(db?.objectStoreNames || []).filter(
      (name) => name !== objectStores.wendlerCycles,
    )) {
      const entries = await getFromCursor(storeName)
      if (Object.keys(entries || {}).length) {
        Object.entries(entries).forEach(([id, data]) => {
          const rowData = [storeName, id]
          if (Object.keys(data || {}).length) {
            Object.entries(data).forEach(([key, val]) => {
              const currentIndex = headerItems.indexOf(key)
              const position =
                currentIndex === -1 ? headerItems?.length : currentIndex

              if (currentIndex === -1) {
                headerItems.push(key)
              }
              rowData[position] =
                typeof val === 'string' ? val.replace(',', '__comma__') : val
            })
          }

          arr.push(rowData.join())
        })
      }
    }
    return `${headerItems.join()}\n${arr.join('\n')}`
  }

  const createBackup = () => {
    generateBackupData().then((res) => {
      const hiddenElement = document.createElement('a')
      hiddenElement.href = `data:text/csv;charset=utf-8, ${encodeURI(res)}`
      hiddenElement.target = '_blank'
      hiddenElement.download = `strength-track-${dayjs().format('YYYY-MM-DD')}`
      hiddenElement.click()
    })
  }

  const clearStore = (store) =>
    new Promise((resolve, reject) => {
      try {
        const objectStoreRequest = db
          .transaction([store], 'readwrite')
          .objectStore(store)
          .clear()

        objectStoreRequest.onsuccess = () => {
          return resolve({ success: true })
        }
        objectStoreRequest.onerror = () =>
          reject(`unable to clear data from ${store}`)
      } catch (err) {
        console.warn(err)
        return reject(err?.message || `unable to clear data from ${store}`)
      }
    })

  const writeItemFromBackup = (item) =>
    new Promise((resolve, reject) => {
      const { store, data, id } = item

      const objectStore = db
        .transaction([store], 'readwrite')
        .objectStore(store)
        .put(data, id)

      objectStore.onsuccess = () => resolve(item)

      objectStore.onerror = (err) => reject(err)
    })

  const restoreFromBackup = async (entries) => {
    // get list of stores to clear.
    const storeClearPromises = entries.stores.map((store) => clearStore(store))
    const itemPromises = entries.items.map((item) => writeItemFromBackup(item))

    const storesResponse = await Promise.all(storeClearPromises)
    const itemResponses = await Promise.all(itemPromises)

    return {
      storesResponse,
      itemResponses,
    }
  }

  return (
    <DBContext.Provider
      value={{
        isInitialized: !!db,
        // WENDLER
        getWendlerCycle: (id) => getWendlerCycle(db, id),
        getWendlerExercises: () => getWendlerExercises(db),
        createCycle: (data) => createCycle(db, data),
        updateWendlerItem: ({ id, path, value }) =>
          updateWendlerItem(db, { id, path, value }),
        // ENTRIES
        getAllEntries: (store) => getAllEntries(db, store),
        deleteEntry: (store, id) => deleteEntry(db, store, id),
        createEntry: (store, data) => createEntry(db, store, data),
        updateEntry: (store, id, data) => updateEntry(db, store, id, data),
        // SETS
        createOrUpdateLoggedSet: (id, data) =>
          createOrUpdateLoggedSet(db, id, data),
        deleteLoggedSet: (id) => deleteLoggedSet(db, id),
        getAllSetsHistory: () => getAllSetsHistory(db),
        getExerciseOptions,
        getExerciseHistoryById,
        getExerciseById,
        createBackup,
        restoreFromBackup,
        createBioMetric: (name) => createBioMetric(db, name),
        getMuscleGroups,
        createRoutine: (data) => createRoutine(db, data),
      }}
    >
      {children}
    </DBContext.Provider>
  )
}

export default function useDB() {
  return useContext(DBContext)
}
