import { h } from 'preact'
import { Link } from 'preact-router/match'

import Icon from '../icon/Icon'
import style from './style.css'

const Header = ({
  toggleMenu,
  menuIsOpen,
  toggleExerciseSearch,
  closeMenu,
  closeExerciseSearch,
  exerciseSearchOpen,
}) => (
  <header class="flex items-center justify-between px-4 h-14 bg-primary-600 z-20">
    <Link class="text-white text-3xl" href="/">
      <Icon name="calendar-outline" width="32" />
    </Link>

    <nav>
      <button
        onClick={() => {
          if (menuIsOpen) {
            closeMenu()
          }
          toggleExerciseSearch()
        }}
      >
        +
      </button>
      <button
        onClick={() => {
          if (exerciseSearchOpen) {
            closeExerciseSearch()
          }
          toggleMenu()
        }}
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
