import { h } from "preact"

import { menuItems } from "../../config/routes"
import LinkList from "../linkList/LinkList"

import styles from "./menu.scss"

const Menu = ({ isOpen }) => (
  <div
    class={`${styles.menu} absolute inset-0 top-14 bg-white bg-opacity-90 ${
      isOpen ? styles.active : ""
    }`}
  >
    <LinkList
      links={menuItems.map(item => ({
        href: item.href,
        text: item.title,
      }))}
    />
  </div>
)

export default Menu
