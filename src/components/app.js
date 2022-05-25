import { h } from "preact"
import { Router } from "preact-router"

import Header from "./header/Header"
// Code-splitting is automated for `routes` directory
import NewSchedule from "../routes/newSchedule/newSchedule"
import Home from "../routes/home/Home"
import Wendler from "../routes/wendler/Wendler"
import Exercise from "../routes/exercise/Exercise"
import useDB, { DBProvider } from "../context/db"

import WendlerWorkout from "../routes/wendler/WendlerWorkout"

const DBWrapper = () => {
  const { isInitialized } = useDB()

  return (
    <div id="app" class="flex flex-col w-full max-w-lg mx-auto ">
      <Header />
      {isInitialized ? (
        <div class="pt-4 flex-1">
          <Router>
            <Home path="/" />
            <NewSchedule path="/new-wendler" />
            <Wendler path="/wendler/:id" />
            <WendlerWorkout path="/wendler/:id/:week/:mainLift" />
            <Exercise path="/exercise/:id/:remaining_path*" />
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
