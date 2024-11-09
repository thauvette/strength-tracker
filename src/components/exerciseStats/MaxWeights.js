import { h } from 'preact';
import dayjs from 'dayjs';
import { useState } from 'preact/hooks';
import AnimateHeight from 'react-animate-height';
import { formatToFixed } from '../../utilities.js/formatNumbers';

const MaxWeights = ({ exerciseHistory, includeBwInHistory }) => {
  const prs = includeBwInHistory
    ? exerciseHistory?.prsWithBW
    : exerciseHistory?.prs;
  return (
    <div class="px-2">
      {prs?.length ? (
        prs.map((set) => (
          <MaxWeightRow
            set={set}
            key={set.reps}
            includeBwInHistory={includeBwInHistory}
          />
        ))
      ) : (
        <p>No prs</p>
      )}
    </div>
  );
};

const MaxWeightRow = ({ set, includeBwInHistory }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { daysWithPr } = set;

  return (
    <div class="border-b-4">
      <button
        disabled={!daysWithPr?.length}
        class="p-0 w-full"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div
          class={`flex items-center justify-between py-4  ${
            set.isActualSet ? 'font-bold' : 'opacity-90'
          }`}
        >
          <p>
            {set.reps} @ {set.displayWeight}
          </p>
          <p>{dayjs(set.date).format('DD MMM YYYY')}</p>
        </div>
      </button>
      <AnimateHeight height={isOpen ? 'auto' : 0}>
        <div class="pb-4">
          {daysWithPr?.length
            ? daysWithPr.reverse().map(({ day, sets }) => (
                <div key={day}>
                  <p class="font-bold">{dayjs(day).format('DD MMM YYYY')}</p>
                  <div class="pl-2">
                    {sets.map((daySet) => {
                      const weight = includeBwInHistory
                        ? formatToFixed(
                            +daySet.weight + (daySet.bw ? +daySet.bw : 0),
                          )
                        : daySet.weight;
                      return (
                        <div
                          key={daySet.created}
                          class={
                            +set.weight === weight && +set.reps === +daySet.reps
                              ? 'bg-blue-900'
                              : ''
                          }
                        >
                          <p>
                            {daySet.reps} @ {weight}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            : null}
        </div>
      </AnimateHeight>
    </div>
  );
};

export default MaxWeights;
