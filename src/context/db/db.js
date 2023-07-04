import { useEffect, useState, createContext, useContext } from 'preact/compat'
import dayjs from 'dayjs'

import {
  getFromCursor as getFromCursorUtil,
  openObjectStoreTransaction as openObjectStoreTransactionUtil,
  getItem,
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
import {
  createEntry,
  deleteEntry,
  getAllEntries,
  getAllEntriesByKey,
  updateEntry,
} from './entries'
import {
  createOrUpdateLoggedSet,
  deleteLoggedSet,
  getAllSetsHistory,
} from './sets'
import { createRoutine, updateRoutine } from './routines'
import { ARRAY_SEPARATOR, COMMA_REPLACEMENT } from '../../config/constants'
import getClosestTimeStamp from '../../utilities.js/getClosestTimeStamp'

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
    new Promise((resolve, reject) => {
      const { objectStore } = openObjectStoreTransaction(objectStores.exercises)
      const keyRange = IDBKeyRange.only(+id)

      const cursorRequest = objectStore.openCursor(keyRange)
      cursorRequest.onsuccess = (event) => {
        resolve(event?.target?.result?.value)
      }
      cursorRequest.onerror = (err) => {
        reject(err)
      }
    })

  const getExerciseHistoryById = (id) =>
    new Promise((resolve, reject) => {
      getExerciseById(id).then(async (exerciseResponse) => {
        if (!exerciseResponse) {
          reject('404')
        }
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
        let weights
        let sortedKeys
        let weightEntries

        weights = await getAllEntriesByKey(
          db,
          objectStores.bioEntries,
          'bioMetric',
          1,
        )
        weightEntries = weights?.reduce(
          (obj, item) => ({
            ...obj,
            [item.created]: item,
          }),
          {},
        )

        sortedKeys = weights?.map((item) => item.created)?.sort((a, b) => a - b)

        const { objectStore } = openObjectStoreTransaction(objectStores.sets)

        const results = []

        // get all sets for this exercise
        const index = objectStore.index('exercise')
        const keyRange = IDBKeyRange.only(+id)
        const cursorRequest = index.openCursor(keyRange)
        cursorRequest.onsuccess = async function (event) {
          const data = event?.target?.result?.value
          if (data) {
            const result = { ...data, id: event?.target?.result?.primaryKey }

            // find the closets bw record
            const closetsKey = getClosestTimeStamp(sortedKeys, result.created)
            const closetsRecord = weightEntries?.[closetsKey]

            if (closetsRecord?.value) {
              result.bw = closetsRecord.value
            }
            results.push(result)
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

    for (const storeName of Array.from(db?.objectStoreNames || [])) {
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

              let formattedValue = val

              // in the case of routines and wendler cycles we have some json to deal with
              if (
                (storeName === objectStores.routines && key === 'days') ||
                (storeName === objectStores.wendlerCycles &&
                  (key === 'exerciseFormValues' || key === 'weeks'))
              ) {
                formattedValue = btoa(JSON.stringify(val))
              } else if (Array.isArray(val)) {
                formattedValue = val.join(ARRAY_SEPARATOR)
              } else if (typeof val === 'string') {
                formattedValue = val.replace(',', COMMA_REPLACEMENT)
              }
              rowData[position] = formattedValue
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
          return resolve({ success: true, store })
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
    const storeClearPromises = entries.stores.map((store) =>
      clearStore(store)
        .then((res) => res)
        .catch((err) => {
          return {
            store,
            error: err,
          }
        }),
    )

    const itemPromises = entries.items.map((item) =>
      writeItemFromBackup(item)
        .then((res) => res)
        .catch((err) => {
          return {
            ...item,
            error: err,
          }
        }),
    )

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
        updateRoutine: (id, data) => updateRoutine(db, id, data),
        getItem: (store, id) => getItem(db, store, id),
      }}
    >
      {children}
    </DBContext.Provider>
  )
}

export default function useDB() {
  return useContext(DBContext)
}
