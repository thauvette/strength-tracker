import { useRef } from 'preact/hooks';
import dayjs from 'dayjs';
import { Fragment } from 'preact/jsx-runtime';

import useIntersectObserver from '../../hooks/useIntersectObserver';
import { formatToFixed } from '../../utilities.js/formatNumbers';
import Icon from '../icon/Icon';
import ChangeIndicator from './ChangeIndicator';

const Day = ({ day, setEditModalState }) => {
  const ref = useRef(null);
  const isIntersecting = useIntersectObserver({
    ref,
  });

  const { items, average, change, dayKey } = day;
  return (
    <div ref={ref} className="mb-3">
      <div className="flex items-center justify-between card-header">
        <p>{dayjs(dayKey).format('ddd MMM DD YYYY')}</p>
        <div class="flex items-center gap-2">
          <p>{formatToFixed(average)}</p>
          {isIntersecting && <ChangeIndicator number={change} />}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_repeat(3,_auto)] items-center gap-1 p-2 card-body">
        {items.map((item) => {
          return (
            <Fragment key={item.id}>
              <div class="flex items-center col-start-1">
                <button
                  onClick={() =>
                    setEditModalState({
                      isOpen: true,
                      item,
                    })
                  }
                  ariaLabel="edit entry"
                >
                  {isIntersecting && <Icon name="create-outline" width="20" />}
                </button>

                <p>{dayjs(item.date).format('h:mm a')}</p>
              </div>

              <p className="font-bold text-sm mr-1">{item.value}</p>
              {isIntersecting && <ChangeIndicator number={item.diff} />}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default Day;
