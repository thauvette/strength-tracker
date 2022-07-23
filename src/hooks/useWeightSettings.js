import { h } from "preact"
import { useState } from "preact/hooks"
import set from "lodash.set"
import get from "lodash.get"
import { LOCAL_STORAGE_PLATE_SETTINGS } from "../config/constants"

export const defaultPlates = [
  { weight: 45, count: 10, available: true },
  { weight: 35, count: 10, available: true },
  { weight: 25, count: 10, available: true },
  { weight: 10, count: 10, available: true },
  { weight: 5, count: 10, available: true },
  { weight: 2.5, count: 10, available: true },
]

const defaultSettings = {
  barWeight: 45,
  availablePlates: defaultPlates,
}

let initialSettings = defaultSettings
if (
  typeof window !== "undefined" &&
  window?.localStorage &&
  localStorage.getItem(LOCAL_STORAGE_PLATE_SETTINGS)
) {
  initialSettings = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_PLATE_SETTINGS)
  )
}

const useWeightSettings =
  typeof window === "undefined"
    ? null
    : () => {
        const [settings, setSettings] = useState(initialSettings)

        const updateStorage = newSettings => {
          localStorage.setItem(
            LOCAL_STORAGE_PLATE_SETTINGS,
            JSON.stringify({ ...newSettings, updated: new Date().getTime() })
          )
        }

        const updateBarWeight = weight => {
          const currentSettings = { ...settings, barWeight: weight }
          setSettings({ ...currentSettings })
          updateStorage(currentSettings)
        }

        const togglePlateAvailability = index => {
          const isChecked = get(
            settings,
            ["availablePlates", index, "available"],
            false
          )
          const result = set(
            settings,
            ["availablePlates", index, "available"],
            !isChecked
          )
          setSettings({ ...result })
          updateStorage(result)
        }

        const updatePlateCount = ({ index, count }) => {
          const result = set(
            settings,
            ["availablePlates", index, "count"],
            count
          )
          setSettings({ ...result })
          updateStorage(result)
        }

        const addPlate = ({ weight, count }) => {
          const currentPlates = get(settings, "availablePlates", [])

          currentPlates.push({
            weight,
            count,
            available: true,
          })
          const result = {
            ...settings,
            availablePlates: currentPlates.sort((a, b) =>
              a.weight > b.weight ? -1 : 1
            ),
          }
          setSettings(result)
          updateStorage(result)
        }

        return {
          barWeight: settings.barWeight,
          availablePlates: settings.availablePlates,
          weightSettings: settings,
          updateBarWeight,
          togglePlateAvailability,
          updatePlateCount,
          updated: settings.updated,
          addPlate,
        }
      }

export default useWeightSettings
