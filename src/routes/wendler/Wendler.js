import { h } from "preact"
import { Router } from "preact-router"
import { routes } from "../../config/routes"
import NewSchedule from "../newSchedule/newSchedule"
import WendlerCycle from "./WendlerCycle"
import WendlerCycles from "./WendlerCycles"
import WendlerWorkout from "./WendlerWorkout"

const Wendler = () => (
  <Router>
    <WendlerCycles path={routes.wendlerCycles} />
    <NewSchedule path={routes.wendlerNew} />
    <WendlerCycle path={routes.wendlerCycle} />
    <WendlerWorkout path={routes.wendlerDay} />
  </Router>
)

export default Wendler
