import { h } from 'preact';
import { useState } from 'preact/hooks';
import { Router, Route } from 'preact-router';
// ROUTES
// Code-splitting is automated for `routes` directory
import { routes } from './config/routes';
import Exercise from './routes/Exercise';
import Backups from './routes/backups';
import Logs from './routes/logs';
import Wendler from './routes/Wendler';
import NewWorkout from './routes/newWorkout';
import Settings from './routes/Settings';
import BioMetrics from './routes/bioMetrics';
import Fasting from './routes/Fasting';
import Routines from './routes/Routines';
import WorkoutAnalysis from './routes/WorkoutAnalysis';
import { AuthContextProvider } from './context/supabase/auth';
import useDB, { DBProvider } from './context/db/db';
import { ToastProvider } from './context/toasts/Toasts';
import useSessionContext, {
  SessionDataProvider,
} from './context/sessionData/sessionData';
import { ThemeProvider } from './context/theme';

import Header from './components/header/Header';
import Menu from './components/menu/Menu';
import LoadingSpinner from './components/LoadingSpinner';
import { DayHistoryModalContextProvider } from './context/dayHistoryModalContext';

import { QuickAddSetModalProvider } from './context/quickAddSetModalContext';
import Authentication from './routes/authentication';

const AppWrapper = () => {
  const { isInitialized } = useDB();

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const toggleMenu = () => setMenuIsOpen(!menuIsOpen);
  const closeMenu = () => setMenuIsOpen(false);

  const { activeRoutine } = useSessionContext();

  return (
    <>
      <div
        id="app"
        class={
          'flex flex-col w-full h-full max-w-lg mx-auto relative bg-1 pb-8'
        }
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
              <Route
                path={`${routes.logs}:optional?/:params?`}
                component={Logs}
              />
              <Route
                path={`${routes.wendlerBase}/:remaining_path*`}
                component={Wendler}
              />
              <Route path={routes.exercise} component={Exercise} />

              <Route path={routes.backups} component={Backups} />

              <Route
                path={`${routes.newWorkout}/:remaining_path*`}
                component={NewWorkout}
              />
              <Route path={routes.settings} component={Settings} />
              <Route path={`${routes.bioCatchAll}`} component={BioMetrics} />
              <Route path={routes.fasting} component={Fasting} />
              <Route path={routes.routines} component={Routines} />
              <Route
                path={routes.workoutAnalysis}
                component={WorkoutAnalysis}
              />
              <Route path={routes.authentication} component={Authentication} />
            </Router>
          </div>
        ) : (
          <div class="flex items-center justify-center p-4">
            <LoadingSpinner />
          </div>
        )}
      </div>
    </>
  );
};
const App = () => (
  <DBProvider>
    <AuthContextProvider>
      <ThemeProvider>
        <ToastProvider>
          <SessionDataProvider>
            <DayHistoryModalContextProvider>
              <QuickAddSetModalProvider>
                <AppWrapper />
              </QuickAddSetModalProvider>
            </DayHistoryModalContextProvider>
          </SessionDataProvider>
        </ToastProvider>
      </ThemeProvider>
    </AuthContextProvider>
  </DBProvider>
);

export default App;
