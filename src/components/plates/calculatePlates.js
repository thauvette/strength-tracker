export default function calculatePlates({
  barWeight = 45,
  targetWeight = 45,
  plateSet,
}) {
  if (!targetWeight || targetWeight <= barWeight) {
    return { plates: [], barWeight };
  }

  const neededWeight = +targetWeight - +barWeight;
  let weightPerSide = neededWeight / 2;
  const filteredPlateSet = plateSet.filter((plate) => plate.available);
  const plates = [];
  let remainder = 0;
  while (weightPerSide > 0) {
    const matchingPlate = filteredPlateSet.find((plate) => {
      return (
        plate.weight <= weightPerSide &&
        Math.floor(plate.count / 2) >
          plates.filter((usedPlate) => usedPlate === plate.weight).length
      );
    });
    const weightToAdd = matchingPlate?.weight || weightPerSide;
    if (matchingPlate?.weight) {
      plates.push(weightToAdd);
    } else {
      remainder = weightToAdd;
    }
    weightPerSide -= weightToAdd;
  }

  return { plates, barWeight, remainder };
}
