import get from 'lodash.get'
import { objectStores } from './config'
import { openObjectStoreTransaction } from './utils/dbUtils'

export const createRoutine = (db, data) =>
  new Promise((resolve) => {
    const { objectStore } = openObjectStoreTransaction(
      db,
      objectStores.routines,
    )
    const addRequest = objectStore.add({
      data,
      created: new Date().getTime(),
    })
    addRequest.onerror = (e) => console.warn(e)
    addRequest.onsuccess = (event) => {
      resolve({
        data,
        id: get(event, 'target.result', null),
      })
    }
  })
