const availablePlates = [45, 35, 25, 10, 5, 2.5]

export default function calculatePlates({ barWeight = 45, targetWeight = 45 }) {
  if (!targetWeight || targetWeight <= barWeight) {
    return { plates: [], barWeight }
  }

  const neededWeight = +targetWeight - +barWeight
  let weightPerSide = neededWeight / 2

  const plates = []

  while (weightPerSide > 0) {
    const weightToAdd =
      availablePlates.find(plate => plate <= weightPerSide) || weightPerSide
    plates.push(weightToAdd)
    weightPerSide -= weightToAdd
  }

  return { plates, barWeight }
}
