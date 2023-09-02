import { h } from 'preact';
import Icon from '../icon/Icon';
import dayjs from 'dayjs';
import dateFormats from '../../config/dateFormats';

const CalendarControls = ({
  isToday,
  toggleCalendar,
  stepByDate,
  activeDate,
  changeDate,
}) => (
  <div className="flex items-center justify-between pb-6">
    <button
      onClick={() => stepByDate(-1)}
      class="text-2xl"
      ariaLabel="previous date"
    >
      <Icon name="arrow-back-outline" />
    </button>
    <div>
      <button class="m-0" onClick={toggleCalendar} ariaLabel="open calendar">
        {isToday ? 'Today' : dayjs(activeDate).format(dateFormats.dayDisplay)}
      </button>
      {isToday ? null : (
        <button
          onClick={() => changeDate(dayjs().format(dateFormats.day))}
          ariaLabel="go to today"
          class="text-2xl"
        >
          <Icon name="calendar-outline" />
        </button>
      )}
    </div>
    <button ariaLabel="next day" class="text-2xl" onClick={() => stepByDate(1)}>
      <Icon name="arrow-forward-outline" />
    </button>
  </div>
);

export default CalendarControls;
