import { h } from 'preact';
import dayjs from 'dayjs';
import { useState } from 'preact/hooks';
import dateFormats from '../config/dateFormats';
import Modal from './modal/Modal';
import Calendar from './calendar/Calendar';
import Icon from './icon/Icon';

interface Props {
  startDate: string | null;
  endDate: string | null;
  onChangeDate: (dates: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
}

const DateRangePicker = ({ startDate, endDate, onChangeDate }: Props) => {
  const [focusedDate, setFocusedDate] = useState<'start' | 'end' | null>(null);
  const [hoverDate, setHoverDate] = useState('');
  const handleDateChange = (date) => {
    if (focusedDate === 'start') {
      onChangeDate({
        startDate: date.format('YYYY-MM-DD'),
        endDate: '',
      });
      return setFocusedDate('end');
    }

    const endIsBeforeStart = date.isBefore(dayjs(startDate), 'days');
    onChangeDate({
      startDate: endIsBeforeStart ? date : startDate,
      endDate: endIsBeforeStart ? '' : date,
    });
    setFocusedDate(endIsBeforeStart ? 'end' : null);
  };

  return (
    <>
      <div class="flex items-center justify-center gap-1 border border-white">
        <button onClick={() => setFocusedDate('start')}>
          {startDate
            ? dayjs(startDate).format(dateFormats.dayDisplay)
            : 'Select a date'}
        </button>
        <Icon name="arrow-forward-outline" />
        <button onClick={() => setFocusedDate('end')}>
          {endDate
            ? dayjs(endDate).format(dateFormats.dayDisplay)
            : 'Select a date'}
        </button>
      </div>

      <Modal isOpen={!!focusedDate} onRequestClose={() => setFocusedDate(null)}>
        <div onMouseLeave={() => setHoverDate('')}>
          <Calendar
            startDate={startDate}
            renderDay={(day) => {
              // disabled state, selected state
              const isDisabled = day.isAfter(dayjs(), 'days');
              const selected =
                day.isSame(dayjs(startDate), 'day') ||
                day.isSame(dayjs(endDate), 'day');

              const isInRange =
                startDate &&
                endDate &&
                day.isAfter(dayjs(startDate), 'days') &&
                day.isBefore(dayjs(endDate), 'days');

              const isInHoverRange =
                startDate &&
                !endDate &&
                day.isAfter(dayjs(startDate), 'days') &&
                (day.isBefore(dayjs(hoverDate), 'days') ||
                  day.isSame(dayjs(hoverDate), 'day'));

              return (
                <button
                  disabled={isDisabled}
                  class={`rounded-none disabled:opacity-50 ${
                    selected ? 'bg-blue-900' : ''
                  } ${isInRange ? 'bg-blue-500' : ''} ${
                    isInHoverRange ? 'bg-blue-300' : ''
                  }`}
                  onClick={() => handleDateChange(day)}
                  onMouseEnter={() => {
                    setHoverDate(day.format());
                  }}
                >
                  {day.format('DD')}
                </button>
              );
            }}
          />
        </div>
      </Modal>
    </>
  );
};

export default DateRangePicker;
