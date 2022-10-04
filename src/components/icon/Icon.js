import { h } from 'preact'

const Icon = ({ name, width = '16' }) => {
  switch (name) {
    case 'arrow-back-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Arrow Back</title>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="48"
            d="M244 400L100 256l144-144M120 256h292"
          />
        </svg>
      )
    case 'arrow-forward-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Arrow Forward</title>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="48"
            d="M268 112l144 144-144 144M392 256H100"
          />
        </svg>
      )
    case 'bar-chart-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Bar Chart</title>
          <path
            d="M32 32v432a16 16 0 0016 16h432"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <rect
            x="96"
            y="224"
            width="80"
            height="192"
            rx="20"
            ry="20"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <rect
            x="240"
            y="176"
            width="80"
            height="240"
            rx="20"
            ry="20"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <rect
            x="383.64"
            y="112"
            width="80"
            height="304"
            rx="20"
            ry="20"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
        </svg>
      )
    case 'calendar-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Calendar</title>
          <rect
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
            x="48"
            y="80"
            width="416"
            height="384"
            rx="48"
          />
          <circle cx="296" cy="232" r="24" fill="currentColor" />
          <circle cx="376" cy="232" r="24" fill="currentColor" />
          <circle cx="296" cy="312" r="24" fill="currentColor" />
          <circle cx="376" cy="312" r="24" fill="currentColor" />
          <circle cx="136" cy="312" r="24" fill="currentColor" />
          <circle cx="216" cy="312" r="24" fill="currentColor" />
          <circle cx="136" cy="392" r="24" fill="currentColor" />
          <circle cx="216" cy="392" r="24" fill="currentColor" />
          <circle cx="296" cy="392" r="24" fill="currentColor" />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
            stroke-linecap="round"
            d="M128 48v32M384 48v32"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
            d="M464 160H48"
          />
        </svg>
      )
    case 'checkmark-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Checkmark</title>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M416 128L192 384l-96-96"
          />
        </svg>
      )
    case 'chevron-down-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Chevron Down</title>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="48"
            d="M112 184l144 144 144-144"
          />
        </svg>
      )
    case 'clipboard-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Clipboard</title>
          <path
            d="M336 64h32a48 48 0 0148 48v320a48 48 0 01-48 48H144a48 48 0 01-48-48V112a48 48 0 0148-48h32"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <rect
            x="176"
            y="32"
            width="160"
            height="64"
            rx="26.13"
            ry="26.13"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
          />
        </svg>
      )
    case 'close-circle-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Close Circle</title>
          <path
            d="M448 256c0-106-86-192-192-192S64 150 64 256s86 192 192 192 192-86 192-192z"
            fill="none"
            stroke="currentColor"
            stroke-miterlimit="10"
            stroke-width="32"
          />
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M320 320L192 192M192 320l128-128"
          />
        </svg>
      )
    case 'copy-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Copy</title>
          <rect
            x="128"
            y="128"
            width="336"
            height="336"
            rx="57"
            ry="57"
            fill="none"
            stroke="currentColor"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <path
            d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
        </svg>
      )
    case 'create-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Create</title>
          <path
            d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <path d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.06-12c6.1-6.09 6.67-16.01.85-22.38zM399.34 90L218.82 270.2a9 9 0 00-2.31 3.93L208.16 299a3.91 3.91 0 004.86 4.86l24.85-8.35a9 9 0 003.93-2.31L422 112.66a9 9 0 000-12.66l-9.95-10a9 9 0 00-12.71 0z" />
        </svg>
      )
    case 'list-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>List</title>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M160 144h288M160 256h288M160 368h288"
          />
          <circle
            cx="80"
            cy="144"
            r="16"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <circle
            cx="80"
            cy="256"
            r="16"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <circle
            cx="80"
            cy="368"
            r="16"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
        </svg>
      )
    case 'reorder-two-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Reorder Two</title>
          <path
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
            d="M112 304h288M112 208h288"
          />
        </svg>
      )
    case 'trash-outline':
      return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="ionicon"
          viewBox="0 0 512 512"
          width={width}
        >
          <title>Trash</title>
          <path
            d="M112 112l20 320c.95 18.49 14.4 32 32 32h184c17.67 0 30.87-13.51 32-32l20-320"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-miterlimit="10"
            stroke-width="32"
            d="M80 112h352"
          />
          <path
            d="M192 112V72h0a23.93 23.93 0 0124-24h80a23.93 23.93 0 0124 24h0v40M256 176v224M184 176l8 224M328 176l-8 224"
            fill="none"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="32"
          />
        </svg>
      )

    default:
      return null
  }
}

export default Icon