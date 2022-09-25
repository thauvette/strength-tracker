import { useEffect, useState, createContext, useContext } from 'preact/compat'
import set from 'lodash.set'
import dayjs from 'dayjs'
import muscleGroups from '../config/muscleGroups'

import {
  getFromCursor as getFromCursorUtil,
  openObjectStoreTransaction as openObjectStoreTransactionUtil,
} from './utils/dbUtils'

const DBContext = createContext()

const DB_VERSION = 4
const DB_NAME = 'track_strength'

export const objectStores = {
  wendlerCycles: 'wendler_cycles',
  exercises: 'exercises',
  sets: 'sets',
  bioMetrics: 'bio_metrics',
  bioEntries: 'bio_metric_entries',
  muscleGroups: 'muscle_groups',
}

export const DBProvider = ({ children }) => {
  const [db, setDb] = useState(null)

  // INITIALIZE OUR DB
  useEffect(() => {
    if (typeof window === 'undefined') {
      return null
    }
    if (!window.indexedDB) {
      alert('this app does not support your browser')
    }
    // initialize DB
    const dbRequest = window.indexedDB.open(DB_NAME, DB_VERSION)
    let requiresExercises = false
    let requiresBioMetrics = false
    let requiresExerciseGroupRefactor = false

    dbRequest.onsuccess = async (e) => {
      const database = e.target.result
      const exerciseTransaction = database.transaction(
        objectStores.exercises,
        'readwrite',
      )
      if (requiresExercises) {
        exerciseTransaction
          .objectStore(objectStores.exercises)
          .add({ name: 'deadlift', primaryGroup: 'back' })
        exerciseTransaction.objectStore(objectStores.exercises).add({
          name: 'barbell bench press',
          primaryGroup: 'chest',
        })
        exerciseTransaction
          .objectStore(objectStores.exercises)
          .add({ name: 'barbell back squat', primaryGroup: 'legs' })
        exerciseTransaction.objectStore(objectStores.exercises).add({
          name: 'standing overhead press',
          primaryGroup: 'shoulders',
        })
      }
      if (requiresBioMetrics) {
        const bioTransaction = database.transaction(
          objectStores.bioMetrics,
          'readwrite',
        )

        const transaction = bioTransaction.objectStore(objectStores.bioMetrics)
        transaction.add({ name: 'weight' })
      }

      if (requiresExerciseGroupRefactor) {
        const muscleGroupTransaction = database.transaction(
          objectStores.muscleGroups,
          'readwrite',
        )

        const musclesStore = muscleGroupTransaction.objectStore(
          objectStores.muscleGroups,
        )
        // need to create all our muscleGroups
        await Promise.all(
          Object.entries(muscleGroups).map(([primaryKey, subGroups]) => {
            return new Promise((resolve) => {
              // add primary key, use response to attach id to subGroups

              const request = musclesStore.add({
                name: primaryKey,
                isPrimary: 1,
                parentGroup: null,
              })

              request.onsuccess = (e) => {
                return Promise.all(
                  subGroups.map(
                    (group) =>
                      new Promise((resolve) => {
                        const subRequest = musclesStore.add({
                          name: group,
                          isPrimary: 0,
                          parentGroup: e.target.result,
                        })
                        subRequest.onsuccess = (event) => {
                          resolve({
                            name: group,
                            isPrimary: 0,
                            parentGroup: e.target.result,
                            id: event.target.result,
                          })
                        }
                      }),
                  ),
                ).then((subGroupResponses) => {
                  // sub groups added
                  resolve([
                    {
                      name: primaryKey,
                      isPrimary: 1,
                      parentGroup: null,
                      id: e.target.result,
                    },
                    ...subGroupResponses,
                  ])
                })
              }
            }).then((res) => {
              // primary group done
              return res
            })
          }),
        ).then(async (res) => {
          // done adding muscle groups
          const addedMuscleGroups = res.flat()
          // get all exercises.
          const currentExercises = await getFromCursorUtil(
            database,
            objectStores.exercises,
          )

          const exerciseStore = database
            .transaction(objectStores.exercises, 'readwrite')
            .objectStore(objectStores.exercises)

          Object.entries(currentExercises || {}).forEach(([id, exercise]) => {
            // match primary group to newly added muscle groups
            const matchingGroup = addedMuscleGroups.find(
              (group) => group.name === exercise?.primaryGroup?.toLowerCase(),
            )
            if (matchingGroup) {
              exerciseStore.put(
                {
                  ...exercise,
                  primaryGroup: matchingGroup.id,
                },
                +id,
              )
            }
          })
        })
      }
      setDb(dbRequest.result)
    }

    dbRequest.onerror = (e) => {
      console.warn(`error:`, e)
    }
    dbRequest.onupgradeneeded = (e) => {
      const db = e.target.result

      if (e.oldVersion < 1) {
        requiresExercises = true
        // this is the first time this db has been initialized
        // it's safe to initialize all object stores
        db.createObjectStore(objectStores.wendlerCycles, {
          autoIncrement: true,
        })
        const exerciseStore = db.createObjectStore(objectStores.exercises, {
          autoIncrement: true,
        })
        exerciseStore.createIndex('name', 'name', { unique: true })
        exerciseStore.createIndex('primaryGroup', 'primaryGroup', {
          unique: false,
        })

        const setsStore = db.createObjectStore(objectStores.sets, {
          autoIncrement: true,
        })
        setsStore.createIndex('exercise', 'exercise', { unique: false })
      }
      if (e.oldVersion < 2) {
        // get setsStore and createIndex
        const setStore = e.currentTarget.transaction.objectStore(
          objectStores.sets,
        )
        setStore.createIndex('created', 'created', { unique: false })
      }
      if (e.oldVersion < 3) {
        requiresBioMetrics = true
        // adding bio metrics
        // add a store for what you want to track
        // and one for entries
        const bioMetricStore = db.createObjectStore(objectStores.bioMetrics, {
          autoIncrement: true,
        })
        bioMetricStore.createIndex('name', 'name', { unique: true })
        bioMetricStore.createIndex('created', 'created', { unique: false })
        const bioEntriesStore = db.createObjectStore(objectStores.bioEntries, {
          autoIncrement: true,
        })
        bioEntriesStore.createIndex('bioMetric', 'bioMetric', { unique: false })
        bioEntriesStore.createIndex('date', 'date', { unique: false })
        bioMetricStore.add({ name: 'weight', created: new Date().getTime() })
      }
      if (e.oldVersion < 4) {
        requiresExerciseGroupRefactor = true
        const musclesStore = db.createObjectStore(objectStores.muscleGroups, {
          autoIncrement: true,
        })
        musclesStore.createIndex('name', 'name', { unique: true })
        musclesStore.createIndex('isPrimary', 'isPrimary', { unique: false })
        musclesStore.createIndex('parentGroup', 'parentGroup', {
          unique: false,
        })
      }
    }
  }, []) // eslint-disable-line

  if (!db) {
    return null
  }

  const getFromCursor = (store) => getFromCursorUtil(db, store)

  const openObjectStoreTransaction = (store) =>
    openObjectStoreTransactionUtil(db, store)

  const getAllEntries = async (store) => await getFromCursor(store)

  // TODO: rename or rework
  const getItemById = (id) =>
    new Promise((resolve, reject) => {
      const { objectStore } = openObjectStoreTransaction(
        objectStores.wendlerCycles,
      )
      const request = objectStore.get(+id)
      request.onerror = function (err) {
        console.warn('Err', err)
        reject(err?.message || 'unable to find item')
      }
      request.onsuccess = (event) => resolve(event.target.result)
    })

  const getItemsByIndex = (storeKey, indexKey, items) =>
    new Promise((resolve, reject) => {
      const { objectStore: store } = openObjectStoreTransaction(
        objectStores[storeKey],
      )
      const index = store.index(indexKey)
      const results = []
      index.openCursor().onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          if (items.some((item) => item === cursor.key)) {
            results.push({
              ...cursor.value,
              primaryId: cursor.primaryKey,
            })
          }
          cursor.continue()
        } else {
          resolve(results)
        }
      }
      index.openCursor().onerror = () => reject()
    })

  const getExerciseOptions = () =>
    new Promise((resolve) => {
      const { objectStore: store } = openObjectStoreTransaction(
        objectStores.exercises,
      )
      const results = []
      store.openCursor().onsuccess = (event) => {
        const cursor = event.target.result
        if (cursor) {
          if (cursor.value?.name) {
            results.push({
              id: cursor.primaryKey,
              name: cursor.value?.name,
              primaryGroup: cursor.value?.primaryGroup,
            })
          }
          cursor.continue()
        } else {
          resolve(results)
        }
      }
    })

  const updateWendlerItem = ({ id, path, value }) =>
    new Promise((resolve, reject) => {
      // get the current item.
      const { objectStore } = openObjectStoreTransaction(
        objectStores.wendlerCycles,
      )
      const request = objectStore.get(+id)

      request.onerror = (err) => reject(err?.message || 'unable to find data')

      request.onsuccess = () => {
        if (!request.result) {
          reject(new Error('unable to find entry'))
        }

        const currentEntry = { ...request.result }

        set(currentEntry, path, value)

        // Put this updated object back into the database.
        const requestUpdate = objectStore.put(currentEntry, +id)

        requestUpdate.onerror = (err) =>
          reject(err?.message || 'unable to update entry')

        // Success - the data is updated!
        requestUpdate.onsuccess = () => resolve(currentEntry)
      }
    })

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

  const createCycle = (data) =>
    new Promise((resolve, reject) => {
      {
        if (!db) {
          return
        }
        const { objectStore, transaction } = openObjectStoreTransaction(
          objectStores.wendlerCycles,
        )

        transaction.oncomplete = function () {
          resolve({ success: true })
        }

        transaction.onerror = function (event) {
          // todo: Don't forget to handle errors!
          console.warn(event, 'oops')
          reject()
        }

        if (data.id) {
          objectStore.put({ ...data, updated: new Date().getTime() }, +data.id)
        } else {
          objectStore.add({ ...data, created: new Date().getTime() })
        }
      }
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
      getExerciseById(id).then((exerciseResponse) => {
        const { objectStore } = openObjectStoreTransaction(objectStores.sets)
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
            resolve({ ...exerciseResponse, items: results })
          }
        }
      })
    })

  const getAllSetsHistory = () =>
    new Promise((resolve) => {
      return Promise.all([
        getFromCursor(objectStores.exercises),
        getFromCursor(objectStores.sets),
      ]).then(([exercises, entries]) => {
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
      hiddenElement.download = `strength-track-${dayjs().format()}`
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

  const resolveMuscleGroups = async () => {
    // get all exercises and primary groups
    // get all muscle groups.
    // for every exercises try to match to a muscle group and update the entry with the id.
  }

  return (
    <DBContext.Provider
      value={{
        getItemById,
        getAllEntries,
        getItemsByIndex,
        createCycle,
        isInitialized: !!db,
        updateWendlerItem,
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
      }}
    >
      {children}
    </DBContext.Provider>
  )
}

export default function useDB() {
  return useContext(DBContext)
}
