import { h } from "preact"
import { Link } from "preact-router/match"

import { routes } from "../../config/routes"

import style from "./style.css"

const Header = ({ toggleMenu, menuIsOpen }) => (
  <header class={style.header}>
    <Link class={style.title} href="/">
      Home
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
