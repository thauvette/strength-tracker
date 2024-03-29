import {
  weeks,
  bigButBoringSetsByWeek,
  firstSetLastWeeksMath,
} from '../config/weights';
import generateRandomId from './generateRandomId';

export default function generateProgram({
  exercises,
  auxVersion,
  initialValues,
}) {
  const lessBoring = auxVersion === 'bbslb';
  const auxPairs = auxVersion
    ? {
        1: lessBoring ? 3 : 1,
        2: lessBoring ? 4 : 2,
        3: lessBoring ? 1 : 3,
        4: lessBoring ? 2 : 4,
      }
    : null;

  return weeks.reduce((obj, week, index) => {
    const weekKey = index + 1;

    if (!obj[weekKey]) {
      obj[weekKey] = {};
    }

    Object.entries(exercises).forEach(([id, info]) => {
      if (!obj[weekKey][id]) {
        const auxData = exercises?.[auxPairs?.[id]];
        obj[weekKey][id] = {
          auxName: auxData?.name || '',
          auxId: auxPairs?.[id],
          exercise: info.name,
          primaryId: info.primaryId,
          runningSets: [],
          main: {},
          aux: {},
          additional: {},
        };
        if (initialValues?.weeks?.[weekKey]?.[id]?.isComplete) {
          obj[weekKey][id].isComplete = true;
        }
      }
      const currentMainSets = initialValues?.weeks?.[weekKey]?.[id]?.main || {};

      week.forEach((set, i) => {
        const matchingSet = Object.values(currentMainSets)?.[i];
        const target = info.weight * set.math;
        const rounded = +target.toFixed(0);
        const wendlerId = matchingSet?.wendlerId || generateRandomId();
        obj[weekKey][id].main[wendlerId] = {
          exercise: info.name,
          reps: set.reps,
          weight: rounded,
          isWarmUp: set.isWarmUp || i <= 2,
          completed: matchingSet?.completed || null,
          primaryId: info.primaryId,
          wendlerGroup: 'main',
          wendlerId,
        };
        obj[weekKey][id].runningSets.push(`${weekKey}.${id}.main.${wendlerId}`);
      });

      if (auxPairs) {
        const auxId = auxPairs[id];

        const matchingAuxData = exercises?.[auxId];

        const auxWeight = exercises[matchingAuxData?.primaryId]?.weight;
        const existingAuxSets =
          initialValues?.weeks?.[weekKey]?.[id]?.aux || {};
        const isSameAuxExercise =
          Object.values(existingAuxSets || {})?.[0]?.primaryId ===
          matchingAuxData?.primaryId;

        let j = 0;
        while (j < 5) {
          const existingSetData =
            isSameAuxExercise && Object.values(existingAuxSets || {})?.[j];
          const multiplier =
            auxVersion === 'fsl'
              ? firstSetLastWeeksMath[index]
              : bigButBoringSetsByWeek[index];
          const target = auxWeight * multiplier;
          const rounded = +target.toFixed(0);
          const wendlerId = existingSetData?.wendlerId || generateRandomId();
          obj[weekKey][id].aux[wendlerId] = {
            exercise: matchingAuxData.name,
            reps: auxVersion === 'fsl' ? 5 : 10,
            weight: rounded,
            completed: existingSetData?.completed || null,
            primaryId: +matchingAuxData.primaryId,
            wendlerGroup: 'aux',
            wendlerId,
          };
          obj[weekKey][id].runningSets.push(
            `${weekKey}.${id}.aux.${wendlerId}`,
          );
          j++;
        }
      }
      // if we are editing we can put our additional exercises back
      // and try to maintain the order they are in.
      const existingWeekAdditional =
        initialValues?.weeks?.[weekKey]?.[id]?.additional || {};
      const existingRunningSets =
        initialValues?.weeks?.[weekKey]?.[id]?.runningSets || [];
      if (
        Object.keys(existingWeekAdditional).length &&
        existingRunningSets?.length
      ) {
        obj[weekKey][id].additional = existingWeekAdditional;
        const initialAdditionalRunningSets = existingRunningSets.filter(
          (setId) =>
            Object.keys(existingWeekAdditional).some(
              (key) => `${weekKey}.${id}.additional.${key}` === setId,
            ),
        );

        obj[weekKey][id].runningSets = [
          ...obj[weekKey][id].runningSets,
          ...initialAdditionalRunningSets,
        ];
      }
    });

    return obj;
  }, {});
}
