import { h } from 'preact'
import Router from 'preact-router'
import { routes } from '../../config/routes'
import ActiveRoutine from './ActiveRoutine'
import CreateRoutine from './CreateRoutine'
import Routine from './Routine'
import RoutineList from './RoutineList'

const Routines = () => {
  return (
    <Router>
      <CreateRoutine path={routes.routinesNew} />
      <RoutineList path={routes.routinesBase} />
      <Routine path={`${routes.routinesBase}/:id`} />
      <ActiveRoutine path={routes.activeRoutine} />
    </Router>
  )
}

export default Routines
