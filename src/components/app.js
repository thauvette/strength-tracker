import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
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

const DBWrapper = () => {
  const { isInitialized } = useDB()

  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const toggleMenu = () => setMenuIsOpen(!menuIsOpen)
  const closeMenu = () => setMenuIsOpen(false)

  return (
    <div id="app" class="flex flex-col w-full max-w-lg mx-auto relative">
      <Header toggleMenu={toggleMenu} menuIsOpen={menuIsOpen} />
      <Menu isOpen={menuIsOpen} />
      {isInitialized ? (
        <div class={`pt-4 flex-1 filter ${menuIsOpen ? 'blur-sm' : ''}`}>
          <Router onChange={closeMenu}>
            <Wendler path={`${routes.wendlerBase}/:remaining_path*`} />
            <Exercise path={routes.exercise} />
            <Backups path={routes.backups} />
            <Logs path={routes.logs} />
            <NewWorkout path={`${routes.newWorkout}/:remaining_path*`} />
            <Settings path={routes.settings} />
            <BioMetrics path={`${routes.bioMetrics}/:remaining_path*`} />
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
