const formatExercise = (data) => {
  // fix for legacy data
  const musclesWorked = Array.isArray(data.musclesWorked)
    ? data.musclesWorked
    : !data.musclesWorked
    ? []
    : [data.musclesWorked]

  const secondaryMusclesWorked = Array.isArray(data.secondaryMusclesWorked)
    ? data.secondaryMusclesWorked
    : !data.secondaryMusclesWorked
    ? []
    : [data.secondaryMusclesWorked]

  return {
    ...data,
    musclesWorked,
    secondaryMusclesWorked,
  }
}

export default formatExercise
