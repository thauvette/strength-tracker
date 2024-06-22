import { h } from 'preact';
import EditableSetList, { Set } from '../EditableSetList';
import Body from '../async/body';

interface Props {
  sets: Set[];
  setSets: (sets: Set[]) => void;
  handleSave: () => void;
}

const CreateRouteDaySets = ({ sets, setSets, handleSave }: Props) => {
  const musclesWorked = sets.reduce(
    (obj, set) => {
      const primary = set?.musclesWorked || [];
      const secondary = set?.secondaryMusclesWorked || [];

      return {
        activePrimary: [...obj.activePrimary, ...primary],
        activeSecondary: [...obj.activeSecondary, ...secondary],
      };
    },
    {
      activePrimary: [],
      activeSecondary: [],
    },
  );

  return (
    <div>
      <EditableSetList sets={sets} setSets={setSets} />
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
