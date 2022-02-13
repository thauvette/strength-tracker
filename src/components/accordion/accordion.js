import { h } from "preact"
import { useState } from "preact/compat"

import style from "./accordion.scss"

export default function Accordion({
  openByDefault = false,
  title,
  children,
  titleClass = "",
}) {
  const [isOpen, setIsOpen] = useState(openByDefault)

  return (
    <div class={style.accordion}>
      <button class="w-full" onClick={() => setIsOpen(!isOpen)}>
        <div class="flex justify-between">
          <p class={titleClass}>{title}</p>
          <span>{isOpen ? "Close" : "Open"}</span>
        </div>
      </button>
      {isOpen && <div>{children}</div>}
    </div>
  )
}
