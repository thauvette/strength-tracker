import { h } from 'preact'
import Router from 'preact-router'
import { routes } from '../../config/routes'
import CreateRoutine from './CreateRoutine'

/**
 * routines array
 *      - days array
 *          - sets - running order. (use "plan" style?)
 *  routine : {
 *      id,
 *      days: [{
 *          name: '',
 *          sets: [{
 *              exercise, // id of exercise
 *              reps
 *              sets
 *              completed? // time stamp
 *              id? // if completed id of set
 *           }]
 *      }]
 *  }
 *
 *  need to be repeatable,
 */

const Routines = () => {
  return (
    <div>
      <h1>Routines</h1>
      <Router>
        <CreateRoutine path={routes.routinesNew} />
      </Router>
    </div>
  )
}

export default Routines
