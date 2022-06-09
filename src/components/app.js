import { h } from "preact"
import { Router } from "preact-router"
import { Link } from "preact-router/match"

import Header from "./header/Header"
// Code-splitting is automated for `routes` directory
import NewSchedule from "../routes/newSchedule/newSchedule"
import WendlerCycles from "../routes/wendler/WendlerCycles"
import WendlerCycle from "../routes/wendler/WendlerCycle"
import Exercise from "../routes/exercise/Exercise"
import Backups from "../routes/backups/backups"

import { routes, menuItems } from "../config/routes"

import useDB, { DBProvider } from "../context/db"

import WendlerWorkout from "../routes/wendler/WendlerWorkout"
import { useState } from "preact/hooks"
import Logs from "../routes/logs/logs"
import Wendler from "../routes/wendler/Wendler"
import NewWorkout from "../routes/workout/newWorkout"

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
          {menuItems.map(item => (
            <div key={item.href} class="p-4">
              <Link href={item.href}>{item.title}</Link>
            </div>
          ))}
        </div>
      )}
      {isInitialized ? (
        <div class="pt-4 flex-1">
          <Router onChange={closeMenu}>
            <Wendler path={`${routes.wendlerBase}/:remaining_path*`} />
            <Exercise path={routes.exercise} />
            <Backups path={routes.backups} />
            <Logs path={routes.logs} />
            <NewWorkout path={`${routes.newWorkout}/:remaining_path*`} />
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
