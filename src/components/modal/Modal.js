import { h } from "preact"
import { useEffect, useRef } from "preact/compat"

export default function Modal({ isOpen, children, onRequestClose }) {
  const contentRef = useRef(null)

  useEffect(() => {
    function handleOutsideClick(e) {
      if (!contentRef.current.contains(e.target)) {
        onRequestClose()
      }
    }
    function handleEscKey(e) {
      if (e.keyCode === 27) {
        onRequestClose()
      }
    }

    if (isOpen && onRequestClose) {
      window.addEventListener("click", handleOutsideClick)
      window.addEventListener("keydown", handleEscKey)
    }
    return () => {
      if (isOpen && onRequestClose) {
        window.removeEventListener("click", handleOutsideClick)
        window.removeEventListener("keydown", handleEscKey)
      }
    }
  }, [isOpen, onRequestClose])

  if (!isOpen) {
    return null
  }
  return (
    <div class="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4 z-50 flex items-center">
      <div class="bg-white w-full px-2 py-4" ref={contentRef}>
        {children}
      </div>
    </div>
  )
}
