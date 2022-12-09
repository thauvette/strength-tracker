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

  const getAllEntries = async (store) => await getFromCursor(store)

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

  const createOrUpdateLoggedSet = (id, data) =>
    new Promise((resolve, reject) => {
      const { objectStore } = openObjectStoreTransaction(objectStores.sets)

      if (!id) {
        const addRequest = objectStore.add({
          ...data,
          created: new Date().getTime(),
        })
        addRequest.onerror = (e) => console.warn(e)
        addRequest.onsuccess = (event) => {
          return resolve({
            ...data,
            created: new Date().getTime(),
            id: event?.target?.result,
          })
        }
      } else {
        const request = objectStore.get(+id)
        request.onsuccess = () => {
          if (!request.result) {
            reject(new Error('unable to find entry'))
          }
          const newValue = {
            ...request.result,
            ...data,
            updated: new Date().getTime(),
          }
          const requestUpdate = objectStore.put(newValue, +id)
          requestUpdate.onerror = (err) =>
            reject(err?.message || 'unable to update entry')

          // Success - the data is updated!
          requestUpdate.onsuccess = (e) =>
            resolve({ ...newValue, id: e?.target?.result })
        }
      }
    })

  const deleteLoggedSet = (id) =>
    new Promise((resolve, reject) => {
      const { objectStore } = openObjectStoreTransaction(objectStores.sets)
      const deleteRequest = objectStore.delete(id)
      deleteRequest.onsuccess = () => resolve(true)
      deleteRequest.onerror = (err) =>
        reject(err?.message || 'unable to delete item')
    })

  const createEntry = (store, data) =>
    new Promise((resolve, reject) => {
      const { transaction, objectStore } = openObjectStoreTransaction(store)
      const request = objectStore.add({
        ...data,
        created: new Date().getTime(),
      })
      request.onsuccess = (event) =>
        resolve({
          ...data,
          id: event.target?.result,
          created: new Date().getTime(),
        })

      transaction.onerror = function (err) {
        // todo: Don't forget to handle errors!
        console.warn(err, 'oops')
        reject(new Error(err?.message || 'unable to create item'))
      }
    })

  const deleteEntry = (store, id) =>
    new Promise((resolve, reject) => {
      const request = db
        .transaction([store], 'readwrite')
        .objectStore(store)
        .delete(+id)
      request.onsuccess = async function () {
        try {
          const remainingData = await getFromCursor(store)
          resolve(remainingData)
        } catch (e) {
          reject(new Error(e?.message || 'something went wrong? '))
        }
      }
    })
  const updateEntry = (store, id, data) =>
    new Promise((resolve, reject) => {
      const { objectStore } = openObjectStoreTransaction(store)

      const request = objectStore.get(+id)
      request.onsuccess = () => {
        if (!request.result) {
          reject(new Error('unable to find entry'))
        }
        const newValue = {
          ...request.result,
          ...data,
          updated: new Date().getTime(),
        }
        const requestUpdate = objectStore.put(newValue, +id)
        requestUpdate.onerror = (err) =>
          reject(err?.message || 'unable to update entry')

        // Success - the data is updated!
        requestUpdate.onsuccess = (e) =>
          resolve({ ...newValue, id: e?.target?.result })
      }
    })
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

  const getAllSetsHistory = () =>
    new Promise((resolve) => {
      return Promise.all([
        getFromCursor(objectStores.exercises),
        getFromCursor(objectStores.sets),
        getFromCursor(objectStores.muscleGroups),
      ]).then(([exercises, entries, muscleGroups]) => {
        const results = Object.values(entries || {})?.reduce((obj, entry) => {
          if (!entry.created || !entry.exercise) {
            return obj
          }

          const dateKey = entry.created
            ? dayjs(entry.created).format('YYYY-MM-DD')
            : 'lost'

          const exercise = exercises[entry.exercise]
          const currentItems = obj[dateKey] || []
          currentItems.push({
            ...exercise,
            ...entry,
            primaryGroupName: muscleGroups?.[exercise?.primaryGroup]?.name,
          })
          return {
            ...obj,
            [dateKey]: currentItems,
          }
        }, {})
        resolve(results)
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

  const createBioMetric = async (name) =>
    new Promise((resolve) => {
      const { objectStore } = openObjectStoreTransaction(
        objectStores.bioMetrics,
      )

      const addRequest = objectStore.add({
        name,
        created: new Date().getTime(),
      })
      addRequest.onerror = (e) => console.warn(e)
      addRequest.onsuccess = (event) => {
        resolve({
          name,
          id: event?.target?.result,
        })
      }
    })

  return (
    <DBContext.Provider
      value={{
        isInitialized: !!db,
        getWendlerCycle: (id) => getWendlerCycle(db, id),

        getWendlerExercises: () => getWendlerExercises(db),
        createCycle: (data) => createCycle(db, data),
        updateWendlerItem: ({ id, path, value }) =>
          updateWendlerItem(db, { id, path, value }),
        getAllEntries,
        deleteEntry,
        createEntry,
        updateEntry,
        createOrUpdateLoggedSet,
        deleteLoggedSet,
        getExerciseOptions,
        getExerciseHistoryById,
        getExerciseById,
        createBackup,
        restoreFromBackup,
        getAllSetsHistory,
        createBioMetric,
        getMuscleGroups,
      }}
    >
      {children}
    </DBContext.Provider>
  )
}

export default function useDB() {
  return useContext(DBContext)
}
