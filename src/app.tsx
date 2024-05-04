import { h } from 'preact';
import { useCallback, useState } from 'preact/hooks';
import { Router, Route } from 'preact-router';
// ROUTES
// Code-splitting is automated for `routes` directory
import { routes } from './config/routes';
import Exercise from './routes/Exercise';
import Backups from './routes/backups';
import Wendler from './routes/Wendler';
import NewWorkout from './routes/newWorkout';
import Settings from './routes/Settings';
import BioMetrics from './routes/bioMetrics';
import Fasting from './routes/Fasting';
import Routines from './routes/Routines';
import WorkoutAnalysis from './routes/WorkoutAnalysis';

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
import Home from './routes/Home';

const AppWrapper = () => {
  const { isInitialized } = useDB();
  const { activeRoutine } = useSessionContext();

  const [menuIsOpen, setMenuIsOpen] = useState(false);

  const toggleMenu = useCallback(
    () => setMenuIsOpen(!menuIsOpen),
    [menuIsOpen],
  );

  const closeMenu = useCallback(() => setMenuIsOpen(false), []);

  return (
    <div
      id="app"
      class={'flex flex-col w-full h-full max-w-lg mx-auto relative bg-1 pb-8'}
    >
      <Menu isOpen={menuIsOpen} toggleMenu={toggleMenu} />
      <Header
        toggleMenu={toggleMenu}
        menuIsOpen={menuIsOpen}
        hasActiveRoutine={!!activeRoutine}
      />
      {isInitialized ? (
        <div class={`filter bg-1 flex-1 py-4 ${menuIsOpen ? 'blur-sm' : ''}`}>
          <Router onChange={closeMenu}>
            <Route
              path={`${routes.logs}:optional?/:params?`}
              component={Home}
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
            <Route path={routes.workoutAnalysis} component={WorkoutAnalysis} />
          </Router>
        </div>
      ) : (
        <div class="flex items-center justify-center p-4">
          <LoadingSpinner />
        </div>
      )}
    </div>
  );
};
const App = () => (
  <DBProvider>
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
  </DBProvider>
);

export default App;
