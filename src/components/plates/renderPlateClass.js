export default function renderPlateClass(weight) {
  if (weight > 35) {
    return `w-6 h-24 bg-primary-900`
  }
  if (weight > 25) {
    return `w-5 h-20 bg-blue-800`
  }
  if (weight > 10) {
    return `w-4 h-16 bg-blue-700`
  }
  if (weight > 5) {
    return `w-3 h-14 bg-blue-600`
  }
  if (weight > 2.5) {
    return `w-2 h-12 bg-blue-500`
  }
  return `w-2 h-8 bg-blue-400`
}
