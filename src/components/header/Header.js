import { h } from "preact"
import { Link } from "preact-router/match"
import style from "./style.css"

const Header = () => (
  <header class={style.header}>
    <Link class={style.title} href="/">
      Home
    </Link>
    <nav>
      <Link activeClassName={style.active} href="/new-wendler">
        New Wendler Cycle
      </Link>
      {/* <Link activeClassName={style.active} href="/profile">
        Me
      </Link>
      <Link activeClassName={style.active} href="/profile/john">
        John
      </Link> */}
    </nav>
  </header>
)

export default Header
