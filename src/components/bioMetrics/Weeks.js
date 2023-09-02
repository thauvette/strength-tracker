import { h } from 'preact';
import { convertDaysToWeeks } from './utils';
import Week from './Week';

const Weeks = ({ days = [] }) => {
  if (!days?.length) {
    return null;
  }
  const weeks = convertDaysToWeeks(days);

  return (
    <div class="py-4">
      <h2>Weeks</h2>
      {weeks.map((week, i) => {
        const previousWeekAverage = Object.values(weeks)?.[i + 1]?.average;

        const change = previousWeekAverage
          ? week.average - previousWeekAverage
          : undefined;

        return <Week key={week.key} week={week} change={change} />;
      })}
    </div>
  );
};

export default Weeks;
