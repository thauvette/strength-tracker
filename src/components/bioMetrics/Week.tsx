import { h } from 'preact';
import dayjs from 'dayjs';
import { Fragment } from 'preact/jsx-runtime';
import AnimateHeight from 'react-animate-height';
import { useRef, useState } from 'preact/hooks';

import useIntersectObserver from '../../hooks/useIntersectObserver';
import Icon from '../icon/Icon';
import ChangeIndicator from './ChangeIndicator';

interface Props {
  week: {
    key: string;
    average: number;
    count: number;
    days: {
      items: {
        id: number;
        diff: number;
        value: number;
      }[];
    }[];
  };
  change: number;
}

const Week = ({ week, change }: Props) => {
  const ref = useRef(null);
  const isIntersecting = useIntersectObserver({
    ref,
  });
  const [showingEntries, setShowingEntries] = useState(false);

  return (
    <div key={week.key} className="mb-3" ref={ref}>
      <div className="flex items-center justify-between p-2 text-lg font-bold card-header">
        <p>Week of {dayjs(week.key).format('MMM DD YYYY')}</p>
        <p>{week.average.toFixed(2)}</p>
      </div>
      {isIntersecting && (
        <div class="card-body p-2 ">
          <div className="flex justify between">
            <button
              className="flex-1 text-left text-sm underline p-0"
              onClick={() => setShowingEntries(!showingEntries)}
            >
              {week?.count} {week?.count > 1 ? 'entries' : 'entry'}
            </button>
            {change !== undefined && (
              <div>
                <div className="flex" items-start>
                  {change !== 0 && (
                    <Icon
                      name={
                        change > 0 ? 'arrow-up-outline' : 'arrow-down-outline'
                      }
                    />
                  )}
                  <p className="ml-2">{change.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>

          <AnimateHeight height={showingEntries ? 'auto' : 0}>
            <div class="border-t grid grid-cols-[1fr_repeat(3,_auto)] gap-1 pt-2">
              {week?.days
                ?.reduce((arr, day) => [...arr, ...(day.items || [])], [])
                ?.map((item) => (
                  <Fragment key={item.id}>
                    <p class="col-start-1">
                      {dayjs(item.date).format('ddd hh:mm')}
                    </p>
                    <p className="font-bold text-sm">{item.value}</p>
                    {item.diff !== undefined && (
                      <ChangeIndicator number={item.diff} />
                    )}
                  </Fragment>
                ))}
            </div>
          </AnimateHeight>
        </div>
      )}
    </div>
  );
};

export default Week;
