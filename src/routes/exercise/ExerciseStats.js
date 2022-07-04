import { h } from "preact"
import { useState } from "preact/hooks"

import ExerciseHistory from "./ExerciseHistory"
import MaxWeights from "./MaxWeights"

const tabs = ["history", "PRs"]

const ExerciseStats = ({ exerciseHistory, openNoteModal }) => {
  const [activeTab, setActiveTab] = useState(tabs[0])

  const renderView = () => {
    switch (activeTab) {
      case "PRs":
        return <MaxWeights exerciseHistory={exerciseHistory} />
      case "history":
      default:
        return (
          <ExerciseHistory
            exerciseHistory={exerciseHistory}
            openNoteModal={openNoteModal}
          />
        )
    }
  }

  return (
    <div class="px-2">
      <div class="pb-4">
        {tabs.map(tab => (
          <button
            key={tab}
            class={`capitalize border-0 border-b-4 rounded-none ${
              activeTab === tab ? " border-blue-900" : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {renderView()}
    </div>
  )
}

export default ExerciseStats
