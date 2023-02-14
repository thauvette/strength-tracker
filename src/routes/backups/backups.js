import { h } from 'preact'
import { useState } from 'preact/hooks'
import Modal from '../../components/modal/Modal'
import useDB from '../../context/db/db'

export default function Backups() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [uploadedData, setUploadedData] = useState(null)

  const { createBackup, restoreFromBackup } = useDB()

  const readFile = (file) => {
    const reader = new FileReader()
    reader.onload = function readSuccess(e) {
      try {
        const rows = e.target.result.split('\n')
        const headers = rows[0].split(',')
        const result = rows.reduce(
          (obj, row, i) => {
            if (i) {
              const items = row.split(',')
              // items 0 and 1 are store and id, everything else goes under value
              const data = {}
              const values = items.slice(2)
              values.forEach((value, index) => {
                if (value) {
                  const formattedValue = value.replace('__comma__', ',')
                  data[headers[index + 2]] = isNaN(formattedValue)
                    ? formattedValue
                    : +formattedValue
                }
              })
              if (!obj.stores.some((storeName) => storeName === items[0])) {
                obj.stores.push(items[0])
              }
              obj.items.push({
                store: items[0],
                id: isNaN(items[1]) ? items[1] : +items[1],
                data,
              })
            }
            return obj
          },
          { stores: [], items: [] },
        )
        // pass this to DB to create entries.
        setUploadedData(result)
      } catch (err) {
        console.log(err)
      }
    }
    reader.readAsText(file)
  }
  function submit(e) {
    setIsLoading(true)
    e.preventDefault()
    const formData = new FormData(e.target)

    restoreFromBackup({
      ...uploadedData,
      stores: formData.get('overwrite') === 'on' ? uploadedData.stores : [],
    })
      .then(() => {
        setIsLoading(false)
        alert('DATA RESTORED')
      })
      .catch((err) => {
        setError(err?.message || 'Restore partially unsuccessful')
      })
  }
  return (
    <div class="px-2">
      {error && <p>{error}</p>}
      <div class="border-b-2 pb-8 mb-8">
        <h2 class="my-2">Back Up</h2>
        <p class="my-4">Automatically generate and download your backup</p>
        <button class="w-full btn primary" onClick={createBackup}>
          BACK UP
        </button>
      </div>
      <h2 class="my-2">Restore</h2>
      <p class="my-2">Restore from a backup. </p>
      <form onSubmit={submit}>
        <label class="flex items-center">
          <input name="overwrite" type="checkbox" />
          <p class="ml-2">Overwrite any existing data</p>
        </label>
        <label>
          <p>Select your file</p>
          <input
            type="file"
            id="upload"
            onInput={(e) => readFile(e?.target?.files?.[0])}
            accept=".csv"
            class="py-2"
          />
        </label>
        <button class="btn primary w-full mt-8" type="submit">
          Upload
        </button>
      </form>
      <Modal isOpen={isLoading}>
        <p>Loading</p>
      </Modal>
    </div>
  )
}
