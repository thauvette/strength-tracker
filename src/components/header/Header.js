import { h } from 'preact'
import { Link } from 'preact-router/match'

import { routes } from '../../config/routes'
import Icon from '../icon/Icon'
import style from './style.css'

const Header = ({ toggleMenu, menuIsOpen }) => (
  <header class="flex items-center justify-between px-4 h-14 bg-primary-600 z-10">
    <Link class="text-white text-3xl" href="/">
      <Icon name="calendar-outline" width="32" />
    </Link>

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
