export default function calculateOneRepMax({ reps, weight }) {
  const val = +weight * +reps * 0.033 + +weight
  return val.toFixed(2)
}
