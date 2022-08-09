import { h } from "preact"
import { useState } from "preact/compat"
import AnimateHeight from "react-animate-height"

import style from "./accordion.scss"
import chevDown from "../../assets/icons/chevron-down-outline.svg"

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
          <img
            class={`w-6 h-6 transform transition-all duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
            src={chevDown}
            alt={isOpen ? "close" : "open"}
          />
        </div>
      </button>
      <AnimateHeight duration={200} height={isOpen ? "auto" : 0}>
        {children}
      </AnimateHeight>
    </div>
  )
}
