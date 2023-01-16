import { h } from 'preact'
import { Link } from 'preact-router/match'

import { routes } from '../../config/routes'
import Icon from '../icon/Icon'
import style from './style.css'

const Header = ({ toggleMenu, menuIsOpen, activeRoutine }) => (
  <header class="flex items-center justify-between px-4 h-14 bg-primary-600 z-10">
    <div class="flex items-center">
      <Link class="text-white text-3xl" href="/">
        <Icon name="calendar-outline" width="32" />
      </Link>
      {activeRoutine && (
        <Link
          class="text-white ml-4"
          href={routes.activeRoutine}
          aria-label="today's routine"
        >
          <Icon name="barbell-outline" width="28" />
        </Link>
      )}
    </div>
    <nav>
      <Link href={routes.newWorkout}>+</Link>
      <button
        onClick={toggleMenu}
        class={`${style.hamburger}
      ${menuIsOpen ? style.hamburgerActive : ''}`}
      >
        <div />
        <div />
        <div />
      </button>
    </nav>
  </header>
)

export default Header
