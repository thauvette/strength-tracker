import { h } from 'preact';
import { useState } from 'preact/hooks';
import useWeightSettings from '../../hooks/useWeightSettings';
import calculatePlates from './calculatePlates';
import PlateControls from './plateControls';
import renderPlateClass from './renderPlateClass';

const Plates = ({ weight: initialWeight, barWeight: initialBarWeight }) => {
  const { weightSettings } = useWeightSettings();

  const [weight, setWeight] = useState(initialWeight);
  const [barWeight, setBarWeight] = useState(
    initialBarWeight || weightSettings?.barWeight || 45,
  );

  const { plates: neededPlates, remainder } = calculatePlates({
    targetWeight: +weight || 0,
    barWeight,
    plateSet: weightSettings?.availablePlates,
  });

  const showBar = weight >= barWeight;

  const plateText = Object.entries(
    neededPlates.reduce((obj, plate) => {
      if (obj[plate]) {
        return {
          ...obj,
          [plate]: obj[plate] + 1,
        };
      }
      return {
        ...obj,
        [plate]: 1,
      };
    }, {}),
  )
    .map(([plate, count]) => ({
      plate: +plate,
      count,
    }))
    .sort((a, b) => (a.plate > b.plate ? -1 : 1))
    .map((plate) => `${plate.count} x ${plate.plate}`);

  return (
    <div>
      <h1 class="mb-4">Plates</h1>
      <PlateControls
        weight={weight}
        setWeight={setWeight}
        barWeight={barWeight}
        setBarWeight={setBarWeight}
      />
      <div class="flex items-center px-2 h-24">
        <div class="flex items-center flex-row-reverse">
          {neededPlates.map((plate, i) => (
            <div
              key={i}
              class={`${renderPlateClass(plate)} ${
                i + 1 < neededPlates.length ? 'border-l border-gray-100' : ''
              } rounded-sm`}
            />
          ))}
        </div>
        {showBar && <div class="h-2 flex-grow bg-gray-300" />}

        <div class="flex items-center">
          {neededPlates.map((plate, i) => (
            <div
              key={i}
              class={`${renderPlateClass(plate)} ${
                i + 1 < neededPlates.length ? 'border-r border-gray-100' : ''
              } rounded-sm`}
            />
          ))}
        </div>
      </div>
      <div class="py-4">
        {showBar ? <p class="text-center">Bar + </p> : null}
        <p class="text-center text-lg">
          {plateText?.length ? `${plateText.join(', ')} per side` : null}
        </p>
        {remainder > 0 && (
          <p class="text-center text-red">
            Weight is off by {remainder.toFixed(2)} per side
          </p>
        )}
      </div>
    </div>
  );
};

export default Plates;
