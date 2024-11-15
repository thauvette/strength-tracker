import { h } from 'preact';
import EditableSetList from '../EditableSetList';
import Body from '../async/body';
import { RoutineSet } from '../../types/types';
import useAugmentSetData from '../../hooks/useAugmentSetData';

interface Props {
  sets: RoutineSet[];
  setSets: (sets: RoutineSet[]) => void;
  handleSave: () => void;
}

const CreateRouteDaySets = ({ sets, setSets, handleSave }: Props) => {
  const exerciseIds = sets.reduce((arr, { exercise }) => {
    if (!arr.includes(exercise)) {
      arr.push(exercise);
    }
    return arr;
  }, []);
  const data = useAugmentSetData({ exerciseIds });
  const musclesWorked = Object.values(data || {}).reduce(
    (obj, item) => {
      if (item?.data?.musclesWorked?.length) {
        obj.activePrimary = obj.activePrimary.concat(
          item?.data?.musclesWorked.map(({ id }) => id),
        );
      }
      return obj;
    },
    {
      activePrimary: [],
      activeSecondary: [],
    },
  );

  return (
    <div>
      <EditableSetList sets={sets} setSets={setSets} />
      {/* Bring this back see above  */}
      <div class="pb-4 px-4 max-w-[10rem] mx-auto">
        <Body {...musclesWorked} />
      </div>
      <div class="fixed bottom-0 left-0 right-0 max-w-lg mx-auto">
        <button class="primary rounded-0 w-full" onClick={handleSave}>
          Save Day
        </button>
      </div>
    </div>
  );
};

export default CreateRouteDaySets;
