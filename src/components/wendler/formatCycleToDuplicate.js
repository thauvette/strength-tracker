import cloneDeep from 'lodash.clonedeep';
import get from 'lodash.get';
import set from 'lodash.set';

const formatCycleForDuplication = (cycle) => {
  const freshCycle = cloneDeep(cycle);
  delete freshCycle.id;
  delete freshCycle.created;
  Object.entries(cycle?.weeks || {}).forEach(([weekKey, days]) => {
    Object.entries(days || {}).forEach(([dayKey, day]) => {
      const dayData = cloneDeep(day);
      delete dayData.isComplete;

      set(freshCycle, ['weeks', weekKey, dayKey], dayData);

      day?.runningSets.forEach((setKey) => {
        const currentSetData = get(cycle, `weeks.${setKey}`);
        const newSetData = {
          ...currentSetData,
          completed: null,
        };
        delete newSetData.setId;
        set(freshCycle, `weeks.${setKey}`, newSetData);
      });
    });
  });

  return freshCycle;
};

export default formatCycleForDuplication;
