import { h } from 'preact'
import { Link } from 'preact-router'

const LinkList = ({ links = [] }) => (
  <ul>
    {links.map(({ href, text }) => (
      <li key={href} class="p-3 border-b">
        <Link href={href} class="text-lg capitalize no-underline">
          {text}
        </Link>
      </li>
    ))}
  </ul>
)

export default LinkList
