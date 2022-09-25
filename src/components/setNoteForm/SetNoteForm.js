import { h } from 'preact'
import { useState } from 'preact/hooks'
import useDB from '../../context/db/db'

const SetNoteForm = ({ text, onSave, id }) => {
  const { createOrUpdateLoggedSet } = useDB()

  const [note, setNote] = useState(text || '')

  const save = async (e) => {
    e.preventDefault()
    await createOrUpdateLoggedSet(id, { note })
    if (onSave) {
      onSave(note)
    }
  }

  return id ? (
    <form onSubmit={save}>
      <div class="py-8">
        <input
          class="w-full"
          type="text"
          onInput={(e) => setNote(e.target.value)}
          value={note}
          placeholder="Note"
        />
      </div>
      <button class="bg-blue-900 text-white" type="submit">
        Save
      </button>
    </form>
  ) : (
    <p>Set id not found, unable to add note</p>
  )
}

export default SetNoteForm
