import { h } from "preact"

const ButtonList = ({ buttons = [] }) => (
  <ul>
    {buttons.map(({ onClick, text }) => (
      <li key={text} class="p-3 border-b">
        <button onClick={onClick} class="text-lg capitalize">
          {text}
        </button>
      </li>
    ))}
  </ul>
)

export default ButtonList
