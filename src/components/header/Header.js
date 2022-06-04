import { h } from "preact"
import { Link } from "preact-router/match"
import style from "./style.css"

const Header = ({ toggleMenu }) => (
  <header class={style.header}>
    <Link class={style.title} href="/">
      Home
    </Link>
    <nav>
      <button onClick={toggleMenu}>Menu</button>
      {/* <Link activeClassName={style.active} href="/new-wendler">
        New Wendler Cycle
      </Link> */}
    </nav>
  </header>
)

export default Header
