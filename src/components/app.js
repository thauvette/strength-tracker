import { h } from 'preact'
import { useState } from 'preact/hooks'
// Code-splitting is automated for `routes` directory
import { Router } from 'preact-router'

import { routes } from '../config/routes'
import useDB, { DBProvider } from '../context/db/db'

import Header from './header/Header'
import Menu from './menu/Menu'

import Exercise from '../routes/exercise/Exercise'
import Backups from '../routes/backups/backups'
import Logs from '../routes/logs/logs'
import Wendler from '../routes/wendler/Wendler'
import NewWorkout from '../routes/workout/newWorkout'
import Settings from '../routes/settings/Settings'
import BioMetrics from '../routes/bioMetrics/bioMetrics'
import { ToastProvider } from '../context/toasts/Toasts'
import { SessionDataProvider } from '../context/sessionData/sessionData'
import Fasting from '../routes/fasting/Fasting'
import ExerciseSearchMenu from './ExerciseSearchMenu'

const DBWrapper = () => {
  const { isInitialized } = useDB()

  const [menuIsOpen, setMenuIsOpen] = useState(false)
  const [exerciseSearchOpen, setExerciseSearchOpen] = useState(false)
  const toggleMenu = () => setMenuIsOpen(!menuIsOpen)
  const closeMenu = () => setMenuIsOpen(false)

  const toggleExerciseSearch = () => setExerciseSearchOpen(!exerciseSearchOpen)
  const closeExerciseSearch = () => setExerciseSearchOpen(false)

  return (
    <div id="app" class="flex flex-col w-full h-full max-w-lg mx-auto relative">
      <Header
        toggleMenu={toggleMenu}
        menuIsOpen={menuIsOpen}
        toggleExerciseSearch={toggleExerciseSearch}
        closeMenu={closeMenu}
        closeExerciseSearch={closeExerciseSearch}
        exerciseSearchOpen={exerciseSearchOpen}
      />
      <Menu isOpen={menuIsOpen} />
      <ExerciseSearchMenu
        isOpen={exerciseSearchOpen}
        closeExerciseSearch={closeExerciseSearch}
      />
      {isInitialized ? (
        <div class={`pt-4 flex-1 filter ${menuIsOpen ? 'blur-sm' : ''}`}>
          <SessionDataProvider>
            <Router onChange={closeMenu}>
              <Wendler path={`${routes.wendlerBase}/:remaining_path*`} />
              <Exercise path={routes.exercise} />
              <Backups path={routes.backups} />
              <Logs path={routes.logs} />
              <NewWorkout path={`${routes.newWorkout}/:remaining_path*`} />
              <Settings path={routes.settings} />
              <BioMetrics path={`${routes.bioMetrics}/:remaining_path*`} />
              <Fasting path={routes.fasting} />
            </Router>
          </SessionDataProvider>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  )
}
const App = () => (
  <DBProvider>
    <ToastProvider>
      <DBWrapper />
    </ToastProvider>
  </DBProvider>
)

export default App
