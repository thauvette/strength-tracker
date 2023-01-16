export const openObjectStoreTransaction = (db, store) => {
  const transaction = db.transaction([store], 'readwrite')
  const objectStore = transaction.objectStore(store)
  return {
    transaction,
    objectStore,
  }
}

export const getFromCursor = (db, store) =>
  new Promise((resolve, reject) => {
    const { transaction, objectStore } = openObjectStoreTransaction(db, store)

    const results = {}

    objectStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result
      if (cursor) {
        results[cursor.key] = cursor.value
        cursor.continue()
      }
    }
    transaction.oncomplete = () => resolve(results)

    transaction.onerror = (err) => {
      console.warn(err)
      reject(new Error(err?.message || 'oops'))
    }
  })

export const getItem = (db, store, id) =>
  new Promise((resolve, reject) => {
    if (!store) {
      reject('store is required')
      return
    }
    if (!id) {
      reject('an id is required')
      return
    }
    const { objectStore } = openObjectStoreTransaction(db, store)
    const request = objectStore.get(+id)
    request.onerror = function (err) {
      console.warn('Err', err)
      reject(err.message || 'unable to find item')
    }
    request.onsuccess = (event) => {
      if (event.target.result) {
        resolve(event.target.result)
      } else {
        reject('not found')
      }
    }
  })
