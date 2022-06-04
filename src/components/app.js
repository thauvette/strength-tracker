import { h } from "preact"
import { Router } from "preact-router"
import { Link } from "preact-router/match"

import Header from "./header/Header"
// Code-splitting is automated for `routes` directory
import NewSchedule from "../routes/newSchedule/newSchedule"
import Home from "../routes/home/Home"
import Wendler from "../routes/wendler/Wendler"
import Exercise from "../routes/exercise/Exercise"
import Backups from "../routes/backups/Backups"

import useDB, { DBProvider } from "../context/db"

import WendlerWorkout from "../routes/wendler/WendlerWorkout"
import { useState } from "preact/hooks"

const DBWrapper = () => {
  const { isInitialized } = useDB()
  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const toggleMenu = () => setMenuIsOpen(!menuIsOpen)
  const closeMenu = () => setMenuIsOpen(false)

  return (
    <div id="app" class="flex flex-col w-full max-w-lg mx-auto relative">
      <Header toggleMenu={toggleMenu} />
      {menuIsOpen && (
        <div class="absolute inset-0 top-14 bg-white">
          <div>
            <Link href="/backups">Backups</Link>
          </div>
        </div>
      )}
      {isInitialized ? (
        <div class="pt-4 flex-1">
          <Router onChange={closeMenu}>
            <Home path="/" />
            <NewSchedule path="/new-wendler" />
            <Wendler path="/wendler/:id" />
            <WendlerWorkout path="/wendler/:id/:week/:mainLift" />
            <Exercise path="/exercise/:id/:remaining_path*" />
            <Backups path="/backups" />
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
