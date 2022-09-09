import { h } from 'preact'
import { useState } from 'preact/hooks'

import ExerciseHistory from './ExerciseHistory'
import MaxWeights from './MaxWeights'
import Volume from './Volume'

const tabs = ['history', 'PRs', 'volume']

const ExerciseStats = ({ exerciseHistory, onChangeSet }) => {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const renderView = () => {
    switch (activeTab) {
      case 'PRs':
        return <MaxWeights exerciseHistory={exerciseHistory} />
      case 'volume':
        return <Volume exerciseHistory={exerciseHistory} />
      case 'history':
      default:
        return (
          <ExerciseHistory
            exerciseHistory={exerciseHistory}
            onChangeSet={onChangeSet}
          />
        )
    }
  }

  return (
    <div class="px-2">
      <div class="pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            class={`capitalize border-0 border-b-4 rounded-none ${
              activeTab === tab ? ' border-blue-900' : ''
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
