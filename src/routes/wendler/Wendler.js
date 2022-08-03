import { h } from "preact"
import { Router } from "preact-router"
import { useState } from "preact/hooks"
import { routes } from "../../config/routes"
import NewSchedule from "./newSchedule/newSchedule"
import Preview from "./newSchedule/components/preview"
import WendlerCycle from "./WendlerCycle"
import WendlerCycles from "./WendlerCycles"
import WendlerWorkout from "./WendlerWorkout"

const Wendler = () => {
  const [newWendlerData, setNewWendlerData] = useState(null)
  return (
    <Router>
      <WendlerCycles path={routes.wendlerCycles} />
      <NewSchedule
        path={routes.wendlerNew}
        onSubmit={setNewWendlerData}
        savedExercises={newWendlerData?.exercises}
      />
      <Preview
        path={routes.wendlerNewPreview}
        preview={newWendlerData?.preview}
        exercises={newWendlerData?.exercises}
      />
      <WendlerCycle path={routes.wendlerCycle} />
      <WendlerWorkout path={routes.wendlerDay} />
    </Router>
  )
}

export default Wendler
