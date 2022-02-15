export const getItemById = id => {
  if (typeof window === "undefined") {
    return null
  }
  try {
    return JSON.parse(localStorage.getItem(id))
  } catch (e) {
    console.log(e)
    return null
  }
}

export const setItem = (id, item) => {
  if (typeof window === "undefined") {
    return null
  }
  console.log(item)
  try {
    localStorage.setItem(id, JSON.stringify(item))
  } catch (e) {
    console.log(e)
    return null
  }
}
