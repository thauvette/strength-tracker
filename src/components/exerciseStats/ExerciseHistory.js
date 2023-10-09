import { h } from 'preact';
import dayjs from 'dayjs';
import ExerciseHistoryDay from './ExerciseHistoryDay';

const ExerciseHistory = ({
  exerciseHistory,
  onChangeSet,
  includeBwInHistory,
  updatePlanedSet,
}) => (
  <>
    {exerciseHistory?.items &&
    Object.keys(exerciseHistory?.items)?.length > 0 ? (
      Object.entries(exerciseHistory.items)
        .sort(([aKey], [bKey]) => (dayjs(aKey).isAfter(bKey) ? -1 : 1))
        .map(([dayKey, items]) => (
          <ExerciseHistoryDay
            key={dayKey}
            items={items}
            onChangeSet={onChangeSet}
            dayKey={dayKey}
            ormTime={exerciseHistory?.eorm?.time}
            includeBwInHistory={includeBwInHistory}
            updatePlanedSet={updatePlanedSet}
          />
        ))
    ) : (
      <p>No history found</p>
    )}
  </>
);

export default ExerciseHistory;
