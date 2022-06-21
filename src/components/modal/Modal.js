import { h } from "preact"
import { useEffect, useRef, createPortal } from "preact/compat"

const ModalElement = ({ isOpen, children, onRequestClose }) => {
  const contentRef = useRef(null)
  useEffect(() => {
    function handleOutsideClick(e) {
      if (contentRef.current && !contentRef.current.contains(e.target)) {
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

  useEffect(() => {
    if (typeof document === undefined) {
      return
    }
    if (isOpen) {
      document.querySelector("body")?.classList.add("modal-open")
    } else {
      document.querySelector("body")?.classList.remove("modal-open")
    }
    return () => {
      if (typeof document === undefined) {
        return
      }
      document.querySelector("body")?.classList.remove("modal-open")
    }
  }, [isOpen])

  if (!isOpen) {
    return null
  }
  return (
    <div
      class="fixed top-0 bottom-0 left-0 right-0 bg-black bg-opacity-75 p-4 z-50 max-h-screen"
      aria-hidden="false"
    >
      <div class="h-full relative">
        <div
          class="modal-content bg-white w-full px-2 py-4 absolute top-1/2 left-1/2 overflow-scroll max-w-lg"
          ref={contentRef}
          style={{
            transform: "translate(-50%, -50%)",
            maxHeight: "calc(100vh - 32px)",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  )
}

const getElement = () => (document ? document.getElementById("app") : null)

const Modal = ({ isOpen, children, onRequestClose }) => {
  return createPortal(
    <ModalElement
      isOpen={isOpen}
      children={children}
      onRequestClose={onRequestClose}
    />,
    getElement()
  )
}

export default Modal
