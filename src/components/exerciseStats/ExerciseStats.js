import { h } from 'preact';
import { useState } from 'preact/hooks';

import ExerciseHistory from './ExerciseHistory';
import MaxWeights from './MaxWeights';
import Charts from './Charts';
import StatsByWeight from './StatsByWeight';

const tabs = ['history', 'PRs', 'charts', 'weight'];

const ExerciseStats = ({
  exerciseHistory,
  onChangeSet = null,
  updatePlanedSet,
  reuseCta,
}) => {
  const [includeBwInHistory, setIncludeBwInHistory] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs[0]);

  const renderView = () => {
    switch (activeTab) {
      case 'PRs':
        return (
          <MaxWeights
            exerciseHistory={exerciseHistory}
            includeBwInHistory={includeBwInHistory}
          />
        );
      case 'charts':
        return (
          <Charts
            exerciseHistory={exerciseHistory}
            includeBwInHistory={includeBwInHistory}
          />
        );
      case 'weight':
        return <StatsByWeight exerciseHistory={exerciseHistory} />;
      case 'history':
      default:
        return (
          <ExerciseHistory
            exerciseHistory={exerciseHistory}
            onChangeSet={onChangeSet}
            includeBwInHistory={includeBwInHistory}
            updatePlanedSet={updatePlanedSet}
            reuseCta={reuseCta}
          />
        );
    }
  };

  return (
    <div class="px-2">
      <div class="pb-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            class={`capitalize border-0 border-b-4 rounded-none ${
              activeTab === tab
                ? 'border-highlight-900 dark:border-highlight-200'
                : ''
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>
      {exerciseHistory?.type === 'bwr' && setIncludeBwInHistory && (
        <label class="flex gap-2 items-center">
          <input
            type="checkbox"
            checked={includeBwInHistory}
            onInput={(e) => {
              setIncludeBwInHistory(e.target.checked);
            }}
          />
          <p>Include body weight in stats</p>
        </label>
      )}
      {renderView()}
    </div>
  );
};

export default ExerciseStats;
