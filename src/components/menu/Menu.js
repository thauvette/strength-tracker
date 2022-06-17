import { h } from "preact"
import { Link } from "preact-router"

import { menuItems } from "../../config/routes"

import styles from "./menu.scss"

const Menu = ({ isOpen }) => (
  <div
    class={`${styles.menu} absolute inset-0 top-14 bg-white bg-opacity-90 ${
      isOpen ? styles.active : ""
    }`}
  >
    {menuItems.map(item => (
      <div key={item.href} class="p-4">
        <Link href={item.href}>{item.title}</Link>
      </div>
    ))}
  </div>
)

export default Menu
