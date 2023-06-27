export default function getClosestTimeStamp(items, target) {
  let result
  let lastDelta

  items.some((item) => {
    const delta = Math.abs(target - item)
    if (delta >= lastDelta) {
      return true
    }
    result = item
    lastDelta = delta
  })
  return result
}
