import { h } from "preact"
import { Router } from "preact-router"

import Header from "./header/Header"
// Code-splitting is automated for `routes` directory
import NewSchedule from "../routes/newSchedule/newSchedule"
import Home from "../routes/home/Home"
import Wendler from "../routes/wendler/Wendler"
import useDB, { DBProvider } from "../context/db"

import Workout from "../routes/workouts/Workout"

const DBWrapper = () => {
  const { isInitialized } = useDB()

  return (
    <div id="app">
      <Header />
      {isInitialized ? (
        <div class="pt-4 max-w-lg m-auto">
          <Router>
            <Home path="/" />
            <NewSchedule path="/new-wendler" />
            <Wendler path="/wendler/:id" />
            <Workout path="/wendler/:id/:week/:mainLift" />
          </Router>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  )
}

const App = () => (
  <DBProvider>
    <DBWrapper />
  </DBProvider>
)

export default App
