import { useEffect, useState, createContext, useContext } from "preact/compat"
import set from "lodash.set"
import dayjs from "dayjs"
const DBContext = createContext()

const DB_VERSION = 2
const DB_NAME = "track_strength"

export const objectStores = {
  wendlerCycles: "wendler_cycles",
  exercises: "exercises",
  sets: "sets",
}

export const DBProvider = ({ children }) => {
  const [db, setDb] = useState(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      return null
    }
    if (!window.indexedDB) {
      alert("this app does not support your browser")
    }
    // initialize DB
    const dbRequest = window.indexedDB.open(DB_NAME, DB_VERSION)
    dbRequest.onsuccess = () => {
      setDb(dbRequest.result)
    }
    dbRequest.onerror = e => {
      console.log(`error:`, e)
    }
    dbRequest.onupgradeneeded = e => {
      const db = e.target.result

      if (e.oldVersion < 1) {
        // this is the first time this db has been initialized
        // it's safe to initialize all object stores
        db.createObjectStore(objectStores.wendlerCycles, {
          autoIncrement: true,
        })
        const exerciseStore = db.createObjectStore(objectStores.exercises, {
          autoIncrement: true,
        })
        exerciseStore.createIndex("name", "name", { unique: true })
        exerciseStore.createIndex("primaryGroup", "primaryGroup", {
          unique: false,
        })
        exerciseStore.transaction.oncomplete = () => {
          const transaction = db
            .transaction(objectStores.exercises, "readwrite")
            .objectStore(objectStores.exercises)
          transaction.add({ name: "deadlift", primaryGroup: "back" })
          transaction.add({
            name: "barbell bench press",
            primaryGroup: "chest",
          })
          transaction.add({ name: "barbell back squat", primaryGroup: "quads" })
          transaction.add({
            name: "standing overhead press",
            primaryGroup: "shoulders",
          })
        }

        const setsStore = db.createObjectStore(objectStores.sets, {
          autoIncrement: true,
        })
        setsStore.createIndex("exercise", "exercise", { unique: false })
      }
      if (e.oldVersion < 2) {
        // get setsStore and createIndex
        const setStore = e.currentTarget.transaction.objectStore(
          objectStores.sets
        )
        setStore.createIndex("created", "created", { unique: false })
      }
    }
  }, [])

  const getFromCursor = store =>
    new Promise((resolve, reject) => {
      const transaction = db.transaction(store)
      const objectStore = transaction.objectStore(store)

      const results = {}

      objectStore.openCursor().onsuccess = event => {
        const cursor = event.target.result
        if (cursor) {
          results[cursor.key] = cursor.value
          cursor.continue()
        }
      }
      transaction.oncomplete = () => resolve(results)

      transaction.onerror = err => {
        console.log(err)
        reject(new Error(err?.message || "oops"))
      }
    })

  const getAllEntries = async store => await getFromCursor(store)

  // TODO: rename or rework
  const getItemById = id =>
    new Promise((resolve, reject) => {
      const objectStore = db
        .transaction([objectStores.wendlerCycles])
        .objectStore(objectStores.wendlerCycles)
      const request = objectStore.get(+id)
      request.onerror = function (err) {
        console.log("Err", err)
        reject(err?.message || "unable to find item")
      }
      request.onsuccess = event => resolve(event.target.result)
    })

  const getItemsByIndex = (storeKey, indexKey, items) =>
    new Promise((resolve, reject) => {
      const store = db
        .transaction([objectStores[storeKey]])
        .objectStore(objectStores[storeKey])

      const index = store.index(indexKey)
      const results = []
      index.openCursor().onsuccess = event => {
        const cursor = event.target.result
        if (cursor) {
          if (items.some(item => item === cursor.key)) {
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
    })

  const getExerciseOptions = () =>
    new Promise((resolve, reject) => {
      const store = db
        .transaction([objectStores.exercises])
        .objectStore(objectStores.exercises)
      const results = []

      store.openCursor().onsuccess = event => {
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
      const objectStore = db
        .transaction([objectStores.wendlerCycles], "readwrite")
        .objectStore(objectStores.wendlerCycles)
      const request = objectStore.get(+id)

      request.onerror = err => reject(err?.message || "unable to find data")

      request.onsuccess = () => {
        if (!request.result) {
          reject(new Error("unable to find entry"))
        }

        const currentEntry = { ...request.result }

        set(currentEntry, path, value)

        // Put this updated object back into the database.
        const requestUpdate = objectStore.put(currentEntry, +id)

        requestUpdate.onerror = err =>
          reject(err?.message || "unable to update entry")

        // Success - the data is updated!
        requestUpdate.onsuccess = () => resolve(currentEntry)
      }
    })

  const createOrUpdateLoggedSet = (id, data) =>
    new Promise((resolve, reject) => {
      const transaction = db.transaction([objectStores.sets], "readwrite")
      const objectStore = transaction.objectStore(objectStores.sets)

      if (!id) {
        const addRequest = objectStore.add({
          ...data,
          created: new Date().getTime(),
        })
        addRequest.onerror = e => console.log(e)
        addRequest.onsuccess = event => {
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
            reject(new Error("unable to find entry"))
          }
          const newValue = {
            ...request.result,
            ...data,
            updated: new Date().getTime(),
          }
          const requestUpdate = objectStore.put(newValue, +id)
          requestUpdate.onerror = err =>
            reject(err?.message || "unable to update entry")

          // Success - the data is updated!
          requestUpdate.onsuccess = e =>
            resolve({ ...newValue, id: e?.target?.result })
        }
      }
    })

  const deleteLoggedSet = id =>
    new Promise((resolve, reject) => {
      const transaction = db.transaction([objectStores.sets], "readwrite")

      const objectStore = transaction.objectStore(objectStores.sets)

      const deleteRequest = objectStore.delete(id)
      deleteRequest.onsuccess = () => resolve(true)
      deleteRequest.onerror = err =>
        reject(err?.message || "unable to delete item")
    })

  const createCycle = data => {
    if (!db) {
      return
    }
    const transaction = db.transaction(
      [objectStores.wendlerCycles],
      "readwrite"
    )
    transaction.oncomplete = function () {}

    transaction.onerror = function (event) {
      // todo: Don't forget to handle errors!
      console.log(event, "oops")
    }

    const objectStore = transaction.objectStore(objectStores.wendlerCycles)
    objectStore.add({ ...data, created: new Date().getTime() })
  }

  const createEntry = (store, data) =>
    new Promise((resolve, reject) => {
      const transaction = db.transaction([store], "readwrite")

      const objectStore = transaction.objectStore(store)
      const request = objectStore.add({
        ...data,
        created: new Date().getTime(),
      })
      request.onsuccess = event =>
        resolve({
          ...data,
          id: event.target?.result,
          created: new Date().getTime(),
        })

      transaction.onerror = function (err) {
        // todo: Don't forget to handle errors!
        console.log(err, "oops")
        reject(new Error(err?.message || "unable to create item"))
      }
    })

  const deleteEntry = (store, id) =>
    new Promise((resolve, reject) => {
      const request = db
        .transaction([store], "readwrite")
        .objectStore(store)
        .delete(+id)
      request.onsuccess = async function () {
        try {
          const remainingData = await getFromCursor(store)
          resolve(remainingData)
        } catch (e) {
          reject(new Error(e?.message || "something went wrong? "))
        }
      }
    })

  const getExerciseById = id =>
    new Promise((resolve, reject) => {
      const store = db
        .transaction([objectStores.exercises])
        .objectStore(objectStores.exercises)
      // const index = store.index("exercise")
      const keyRange = IDBKeyRange.only(+id)

      const cursorRequest = store.openCursor(keyRange)
      cursorRequest.onsuccess = event => {
        resolve(event?.target?.result?.value)
      }
    })

  const getExerciseHistoryById = id =>
    new Promise((resolve, reject) => {
      getExerciseById(id).then(exerciseResponse => {
        const store = db
          .transaction([objectStores.sets])
          .objectStore(objectStores.sets)
        const index = store.index("exercise")
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
    new Promise((resolve, reject) => {
      return Promise.all([
        getFromCursor(objectStores.exercises),
        getFromCursor(objectStores.sets),
      ]).then(([exercises, entries]) => {
        const results = Object.values(entries || {})?.reduce((obj, entry) => {
          const dateKey = dayjs(entry.created).format("YYYY-MM-DD")
          const exercise = exercises[entry.exercise]
          const currentItems = obj[dateKey] || []
          currentItems.push({
            ...entry,
            ...exercise,
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
    const headerItems = ["store", "id"]

    for (const storeName of Array.from(db?.objectStoreNames || []).filter(
      name => name !== objectStores.wendlerCycles
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
                typeof val === "string" ? val.replace(",", "__comma__") : val
            })
          }

          arr.push(rowData.join())
        })
      }
    }
    return `${headerItems.join()}\n${arr.join("\n")}`
  }

  const createBackup = () => {
    generateBackupData().then(res => {
      const hiddenElement = document.createElement("a")
      hiddenElement.href = `data:text/csv;charset=utf-8, ${encodeURI(res)}`
      hiddenElement.target = "_blank"
      hiddenElement.download = `backup-${new Date().getTime()}`
      hiddenElement.click()
    })
  }

  const clearStore = store =>
    new Promise((resolve, reject) => {
      try {
        const objectStoreRequest = db
          .transaction([store], "readwrite")
          .objectStore(store)
          .clear()

        objectStoreRequest.onsuccess = () => {
          return resolve({ success: true })
        }
        objectStoreRequest.onerror = () =>
          reject(`unable to clear data from ${store}`)
      } catch (err) {
        console.log(err)
        return reject(err?.message || `unable to clear data from ${store}`)
      }
    })

  const writeItemFromBackup = item =>
    new Promise((resolve, reject) => {
      const { store, data, id } = item

      const objectStore = db
        .transaction([store], "readwrite")
        .objectStore(store)
        .put(data, id)

      objectStore.onsuccess = () => resolve(item)

      objectStore.onerror = err => reject(err)
    })

  const restoreFromBackup = async entries => {
    // get list of stores to clear.
    const storeClearPromises = entries.stores.map(store => clearStore(store))
    const itemPromises = entries.items.map(item => writeItemFromBackup(item))

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
        getItemById,
        getAllEntries,
        getItemsByIndex,
        createCycle,
        isInitialized: !!db,
        updateWendlerItem,
        deleteEntry,
        createEntry,
        createOrUpdateLoggedSet,
        deleteLoggedSet,
        getExerciseOptions,
        getExerciseHistoryById,
        getExerciseById,
        createBackup,
        restoreFromBackup,
        getAllSetsHistory,
      }}
    >
      {children}
    </DBContext.Provider>
  )
}

export default function useDB() {
  return useContext(DBContext)
}
