import { h } from 'preact'
import { useState } from 'preact/hooks'
import { Router } from 'preact-router'
// ROUTES
// Code-splitting is automated for `routes` directory
import { routes } from './config/routes'
import Exercise from './routes/Exercise'
import Backups from './routes/backups'
import Logs from './routes/logs'
import Wendler from './routes/Wendler'
import NewWorkout from './routes/newWorkout'
import Settings from './routes/Settings'
import BioMetrics from './routes/bioMetrics'
import Fasting from './routes/Fasting'
import Routines from './routes/Routines'

import useDB, { DBProvider } from './context/db/db'
import { ToastProvider } from './context/toasts/Toasts'
import useSessionContext, {
  SessionDataProvider,
} from './context/sessionData/sessionData'
import { ThemeProvider } from './context/theme'

import Header from './components/header/Header'
import Menu from './components/menu/Menu'
import LoadingSpinner from './components/LoadingSpinner'

const AppWrapper = () => {
  const { isInitialized } = useDB()

  const [menuIsOpen, setMenuIsOpen] = useState(false)

  const toggleMenu = () => setMenuIsOpen(!menuIsOpen)
  const closeMenu = () => setMenuIsOpen(false)

  const { activeRoutine } = useSessionContext()

  return (
    <>
      <div
        id="app"
        class={`flex flex-col w-full h-full max-w-lg mx-auto relative bg-1`}
      >
        <Menu isOpen={menuIsOpen} toggleMenu={toggleMenu} />
        <Header
          toggleMenu={toggleMenu}
          menuIsOpen={menuIsOpen}
          activeRoutine={activeRoutine}
        />
        {isInitialized ? (
          <div class={`filter bg-1 flex-1 py-4 ${menuIsOpen ? 'blur-sm' : ''}`}>
            <Router onChange={closeMenu}>
              <Wendler path={`${routes.wendlerBase}/:remaining_path*`} />
              <Exercise path={routes.exercise} />
              <Backups path={routes.backups} />
              <Logs path={routes.logs} />
              <NewWorkout path={`${routes.newWorkout}/:remaining_path*`} />
              <Settings path={routes.settings} />
              <BioMetrics path={`${routes.bioCatchAll}`} />
              <Fasting path={routes.fasting} />
              <Routines path={routes.routines} />
            </Router>
          </div>
        ) : (
          <div class="flex items-center justify-center p-4">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </>
  )
}
const App = () => (
  <DBProvider>
    <ThemeProvider>
      <ToastProvider>
        <SessionDataProvider>
          <AppWrapper />
        </SessionDataProvider>
      </ToastProvider>
    </ThemeProvider>
  </DBProvider>
)

export default App
