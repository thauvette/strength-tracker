import { h } from "preact"
import { Link } from "preact-router/match"

import { routes } from "../../config/routes"
import calIcon from "../../assets/icons/calendar-outline-white.svg"
import style from "./style.css"

const Header = ({ toggleMenu, menuIsOpen }) => (
  <header class="flex items-center justify-between px-4 h-14 bg-primary-600 z-10">
    <Link class="" href="/">
      <img class="w-8" src={calIcon} alt="calendar" />
    </Link>

    <nav>
      <Link href={routes.newWorkout}>+</Link>
      <button
        onClick={toggleMenu}
        class={`${style.hamburger}
      ${menuIsOpen ? style.hamburgerActive : ""}`}
      >
        <div />
        <div />
        <div />
      </button>
    </nav>
  </header>
)

export default Header
