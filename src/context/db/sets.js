import dayjs from 'dayjs'
import { objectStores } from './config'
import { getFromCursor, openObjectStoreTransaction } from './utils/dbUtils'

export const createOrUpdateLoggedSet = (db, id, data) =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(db, objectStores.sets)

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

export const deleteLoggedSet = (db, id) =>
  new Promise((resolve, reject) => {
    const { objectStore } = openObjectStoreTransaction(db, objectStores.sets)
    const deleteRequest = objectStore.delete(id)
    deleteRequest.onsuccess = () => resolve(true)
    deleteRequest.onerror = (err) =>
      reject(err?.message || 'unable to delete item')
  })

export const getAllSetsHistory = (db) =>
  new Promise((resolve) => {
    return Promise.all([
      getFromCursor(db, objectStores.exercises),
      getFromCursor(db, objectStores.sets),
      getFromCursor(db, objectStores.muscleGroups),
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
