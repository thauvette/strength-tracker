import { h } from 'preact'
import Router, { route } from 'preact-router'
import { useState } from 'preact/hooks'
import { routes } from '../../config/routes'
import ActiveRoutine from './ActiveRoutine'
import CreateRoutine from './CreateRoutine'
import Routine from './Routine'
import RoutineList from './RoutineList'

const Routines = () => {
  const [editRoutineValues, setEditRoutineValues] = useState(null)

  const navigateToEdit = (routine) => {
    setEditRoutineValues(routine)
    route(routes.routinesNew)
  }
  return (
    <Router>
      <CreateRoutine
        path={routes.routinesNew}
        initialValues={editRoutineValues}
      />
      <RoutineList path={routes.routinesBase} navigateToEdit={navigateToEdit} />
      <Routine path={`${routes.routinesBase}/:id`} />
      <ActiveRoutine path={routes.activeRoutine} />
    </Router>
  )
}

export default Routines
