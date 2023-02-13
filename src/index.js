import { h } from 'preact'
import './style/index.scss'
import App from './components/app'

export default function Root() {
  return (
    <div id="preact_root" class="bg-1">
      <App />
    </div>
  )
}
