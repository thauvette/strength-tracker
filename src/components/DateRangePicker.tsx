import { h } from 'preact';
import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'preact/hooks';
import dateFormats from '../config/dateFormats';
import Modal from './modal/Modal';
import Calendar from './calendar/Calendar';
import Icon from './icon/Icon';
import LogsCalendar from './LogsCalendar/LogsCalendar';

interface Props {
  startDate: string | null;
  endDate: string | null;
  onChangeDate: (dates: {
    startDate: string | null;
    endDate: string | null;
  }) => void;
  useLogs?: boolean;
}

const DateRangePicker = ({
  startDate,
  endDate,
  onChangeDate,
  useLogs = false,
}: Props) => {
  const [focusedDate, setFocusedDate] = useState<'start' | 'end' | null>(null);
  const [hoverDate, setHoverDate] = useState('');
  const handleDateChange = (date: Dayjs) => {
    if (focusedDate === 'start') {
      onChangeDate({
        startDate: date.format('YYYY-MM-DD'),
        endDate: '',
      });
      return setFocusedDate('end');
    }

    const endIsBeforeStart = date.isBefore(dayjs(startDate), 'days');
    onChangeDate({
      startDate: endIsBeforeStart ? date.format('YYYY-MM-DD') : startDate,
      endDate: endIsBeforeStart ? '' : date.format('YYYY-MM-DD'),
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
          {useLogs ? (
            <div>
              <p class="text-center mb-4 font-bold text-lg">
                {`${
                  startDate ? dayjs(startDate).format('ddd MMM DD YYYY') : '--'
                } to ${
                  endDate ? dayjs(endDate).format('ddd MMM DD YYYY') : '--'
                }`}
              </p>
              <LogsCalendar
                initialDate={dayjs(startDate).toDate()}
                selectDate={handleDateChange}
              />
            </div>
          ) : (
            <Calendar
              startDate={
                startDate ? dayjs(startDate).toDate() : dayjs().toDate()
              }
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
          )}
        </div>
      </Modal>
    </>
  );
};

export default DateRangePicker;
