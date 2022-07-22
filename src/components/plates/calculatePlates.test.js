import { defaultPlates } from "../../hooks/useWeightSettings"
import calculatePlates from "./calculatePlates"

describe("Plate Calculation Tests", () => {
  test("it should calculate the correct plates", () => {
    const result = calculatePlates({
      targetWeight: 270,
      plateSet: defaultPlates,
    })

    expect(result).toStrictEqual({
      plates: [45, 45, 10, 10, 2.5],
      barWeight: 45,
      remainder: 0,
    })
  })

  test("it should only use the available plate count", () => {
    const result = calculatePlates({
      targetWeight: 270,
      plateSet: [
        {
          weight: 35,
          count: 2,
          available: true,
        },
        {
          weight: 25,
          count: 2,
          available: true,
        },
        {
          weight: 10,
          count: 4,
          available: true,
        },
      ],
    })
    expect(result).toStrictEqual({
      plates: [35, 25, 10, 10],
      barWeight: 45,
      remainder: 32.5,
    })
  })
})
