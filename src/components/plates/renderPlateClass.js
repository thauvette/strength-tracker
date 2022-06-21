export default function renderPlateClass(weight) {
  switch (weight) {
    case 45:
      return `w-6 h-24 bg-blue-900`
    case 35:
      return `w-5 h-20 bg-blue-800`
    case 25:
      return `w-4 h-16 bg-blue-700`
    case 10:
      return `w-3 h-14 bg-blue-600`
    case 5:
      return `w-2 h-12 bg-blue-500`
    case 2.5:
      return `w-2 h-8 bg-blue-400`
    default:
      return "w-2 h-4 bg-gray-400"
  }
}
