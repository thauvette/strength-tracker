import { h } from 'preact';
import dayjs from 'dayjs';
import ExerciseHistoryDay from './ExerciseHistoryDay';

const ExerciseHistory = ({
  exerciseHistory,
  onChangeSet,
  includeBwInHistory,
  updatePlanedSet,
  reuseCta,
}) => {
  const sortedHistory = Object.entries(exerciseHistory?.items || {}).sort(
    ([aKey], [bKey]) => (dayjs(aKey).isAfter(bKey) ? -1 : 1),
  );

  return (
    <>
      {sortedHistory?.length ? (
        sortedHistory.map(([dayKey, items], index) => {
          const volume = exerciseHistory?.volumeByDay?.[dayKey];
          const previousVolume =
            exerciseHistory?.volumeByDay?.[sortedHistory[index + 1]?.[0]];

          return (
            <ExerciseHistoryDay
              key={dayKey}
              items={items}
              onChangeSet={onChangeSet}
              dayKey={dayKey}
              ormTime={exerciseHistory?.eorm?.time}
              includeBwInHistory={includeBwInHistory}
              updatePlanedSet={updatePlanedSet}
              reuseCta={reuseCta}
              volume={volume}
              previousVolume={previousVolume}
              openByDefault={index < 3}
            />
          );
        })
      ) : (
        <p>No history found</p>
      )}
    </>
  );
};

export default ExerciseHistory;
