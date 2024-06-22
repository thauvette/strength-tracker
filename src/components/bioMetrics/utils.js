import dayjs from 'dayjs';
import { formatToFixed } from '../../utilities.js/formatNumbers';

export const convertDays = (days, startOf = 'week') => {
  const result =
    days?.reduce((obj, day) => {
      const key = dayjs(day.dayKey).startOf(startOf).format('YYYY-MM-DD');

      const currentDays = obj[key]?.days || [];
      currentDays.push(day);
      const currentWeightInCount = obj[key]?.count || 0;

      const groupAverage =
        currentDays.reduce((num, { average }) => num + average, 0) /
        currentDays?.length;

      return {
        ...obj,
        [key]: {
          key,
          average: groupAverage,
          days: currentDays,
          count: currentWeightInCount + (day?.items?.length || 0),
        },
      };
    }, {}) || {};
  return Object.values(result);
};

export const convertDaysToWeeks = (days) => convertDays(days, 'week');

const chunkWeeks = (days, dateFormat = 'ddd') => {
  const weeks = convertDaysToWeeks(days);
  return weeks?.map((week) => {
    return {
      title: `Week of ${dayjs(week.key).format('MMM DD')}`,
      dateFormat,
      average: week.average,
      dayKey: week.key,
      items: week.days.map((day) => ({
        ...day,
        x: dayjs(day.dayKey).toDate().getTime(),
        y: day.average,
      })),
    };
  });
};
const chunkMonths = (days) => {
  const months = convertDays(days, 'month');
  return months?.map((month) => ({
    title: `${dayjs(month.key).format('MMMM YYYY')}`,
    dateFormat: 'ddd DD',
    items: month.days.map((day) => ({
      ...day,
      x: dayjs(day.dayKey).toDate().getTime(),
      y: day.average,
    })),
  }));
};

const chunkByRange = (days, range = 8, timeSpan = 'weeks') => {
  // from last entry go back in chucks of "range"
  // until we reach the earliest entry

  const dates = days.map((day) => dayjs(day.dayKey).toDate().getTime());
  const lastEntry = Math.max(...dates);
  const firstEntry = Math.min(...dates);

  const diff = Math.ceil(
    dayjs(lastEntry).diff(dayjs(firstEntry), timeSpan, true),
  );
  const keys = Array.from({ length: Math.ceil(diff / range) }, (_, i) =>
    dayjs(lastEntry)
      .subtract((i + 1) * range, timeSpan)
      .format('YYYY-MM-DD'),
  );

  const chunks = days.reduce((obj, day) => {
    // find the appropriate key

    const key = keys.find((key) => {
      // we are searching from the end back in time
      // the day key is the same or before the key

      // is the same as key
      if (dayjs(day.dayKey).isSame(dayjs(key))) {
        return true;
      }
      const dayjsObj = dayjs(day.dayKey);
      return dayjsObj.isAfter(key, 'days');
    });
    const items = obj?.[key] || [];
    items.push({
      dayKey: day.dayKey,
      x: dayjs(day.dayKey).toDate().getTime(),
      y: day.average,
    });

    return {
      ...obj,
      [key]: items,
    };
  }, {});
  return Object.values(chunks).reduce((arr, chunk) => {
    const days = chunk.map((day) => dayjs(day.dayKey).toDate().getTime());

    const earliestDay = Math.min(...days);
    const latestDay = Math.max(...days);
    const diff = dayjs(latestDay).diff(dayjs(earliestDay), timeSpan, true);
    arr.push({
      title: `${dayjs(earliestDay).format('MMM DD YYYY')} - ${dayjs(
        latestDay,
      ).format('MMM DD YYYY')}`,
      subTitle: `${formatToFixed(diff)} ${timeSpan}`,
      items: chunk,
    });

    return arr;
  }, []);
};

export const renderData = ({ days, timeSpan, chartGrouping }) => {
  const dataArray =
    chartGrouping === 'week' ? chunkWeeks(days || [], 'MMM DD') : days;

  switch (timeSpan) {
    case 'week':
      return chunkWeeks(dataArray || []);
    case 'month':
      return chunkMonths(dataArray || []);
    case 'all':
      return [
        {
          title: 'All Time',
          dateFormat: 'MM/YY',
          items: dataArray.map((entry) => ({
            ...entry,
            x: dayjs(entry.dayKey).toDate().getTime(),
            y: entry.average,
          })),
        },
      ];
    case '8 weeks':
      return chunkByRange(dataArray, 8, 'weeks');
    case '6 weeks':
      return chunkByRange(dataArray, 6, 'weeks');
    case '4 weeks':
      return chunkByRange(dataArray, 4, 'weeks');
    case '6 months':
      return chunkByRange(dataArray, 6, 'months');
    case '3 months':
      return chunkByRange(dataArray, 3, 'months');
    case '1 year':
      return chunkByRange(dataArray, 1, 'years');
    default:
      return null;
  }
};
