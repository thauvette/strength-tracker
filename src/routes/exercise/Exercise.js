import { h } from "preact"
import { useState } from "preact/hooks"
import { Router, Link } from "preact-router"
import dayjs from "dayjs"
import ExerciseStats from "./ExerciseStats"
import Track from "./Track"
import { routes } from "../../config/routes"
import useExerciseHistory from "../../hooks/useExerciseHistory/useExerciseHistory"
import Modal from "../../components/modal/Modal"
import SetNoteForm from "../../components/setNoteForm/SetNoteForm"

const Exercise = props => {
  const { id, remaining_path } = props
  const [exerciseHistory, getData] = useExerciseHistory(id)

  const [noteModalState, setNoteModalState] = useState({
    set: null,
    isOpen: false,
  })

  const openNoteModal = set => {
    setNoteModalState({
      set,
      isOpen: true,
    })
  }

  const closeNoteModal = () => {
    setNoteModalState({
      set: null,
      isOpen: false,
    })
  }

  if (!exerciseHistory) {
    return null
  }

  const itemsArrays = Object.values(exerciseHistory?.items || {})
  const lastIndex = Object.values(exerciseHistory?.items || {})?.length
    ? Object.values(exerciseHistory?.items || {})?.length - 1
    : 0

  const lastWorkoutFirstSet =
    itemsArrays?.[lastIndex]?.sort((a, b) =>
      a.create < b.create ? -1 : 1
    )?.[0] || null

  return (
    <div>
      <h1 class="capitalize mb-2">{exerciseHistory?.name}</h1>
      <div class="flex pb-4">
        <Link
          href={`${routes.exerciseBase}/${id}`}
          class={`px-4 py-2 bg-blue-100 text-gray-800 no-underline border-b-4 border-blue-900 ${
            !remaining_path ? "" : "border-opacity-0"
          }`}
        >
          Track
        </Link>
        <Link
          href={`${routes.exerciseBase}/${id}/history`}
          class={`px-4 py-2 bg-blue-100  text-gray-800 no-underline border-b-4 border-blue-900 ${
            remaining_path === "history" ? "" : "border-opacity-0"
          }`}
        >
          History
        </Link>
      </div>

      <Router>
        <Track
          path={`${routes.exerciseBase}/:id`}
          todaysHistory={
            exerciseHistory?.items?.[dayjs().format("YYYY-MM-DD")] || []
          }
          exerciseId={id}
          onAddSet={getData}
          lastWorkoutFirstSet={lastWorkoutFirstSet}
          openNoteModal={openNoteModal}
        />
        <ExerciseStats
          path={`${routes.exerciseBase}/:id/history`}
          exerciseHistory={exerciseHistory}
          openNoteModal={openNoteModal}
        />
      </Router>
      {noteModalState.isOpen && (
        <Modal isOpen={noteModalState.isOpen} onRequestClose={closeNoteModal}>
          <div class="flex justify-between items-center pb-4">
            <h1>Note</h1>
            <button onClick={closeNoteModal}>Close X</button>
          </div>
          <SetNoteForm
            text={noteModalState.set?.note || ""}
            onSave={() => {
              closeNoteModal()
              getData()
            }}
            id={noteModalState.set?.id || null}
          />
        </Modal>
      )}
    </div>
  )
}

export default Exercise
