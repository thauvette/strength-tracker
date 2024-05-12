import { objectStores } from './config';
import { MuscleGroup } from './types';
import { getFromCursor } from './utils/dbUtils';

export const getMuscleGroups = async (db) => {
  const groups = await getFromCursor<MuscleGroup>(
    db,
    objectStores.muscleGroups,
  );
  return Promise.resolve(
    Object.entries(groups || {}).reduce((obj, [id, group]) => {
      const primaryGroupId = group.isPrimary ? id : group.parentGroup;

      let currentPrimaryData = obj[primaryGroupId] || {
        secondaryGroups: [],
      };

      if (group.isPrimary) {
        currentPrimaryData = {
          ...currentPrimaryData,
          ...group,
          id: +id,
        };
      } else {
        const groupData = {
          ...group,
          id: +id,
        };
        currentPrimaryData.secondaryGroups.push(groupData);
        obj[id] = groupData;
      }
      obj[primaryGroupId] = currentPrimaryData;
      return obj;
    }, {}),
  );
};
