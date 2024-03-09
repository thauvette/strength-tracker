import { h } from 'preact';
import { Link } from 'preact-router/match';
import { routes } from '../../config/routes';
import Icon from '../icon/Icon';
import style from './style.scss';

interface Props {
  toggleMenu: () => void;
  menuIsOpen: boolean;
  hasActiveRoutine?: boolean;
}
const Header = ({ toggleMenu, menuIsOpen, hasActiveRoutine }: Props) => (
  <header class="flex items-center justify-between px-4 h-14 bg-2 z-20">
    <div class="flex items-center">
      <Link
        class="text-primary-900 dark:text-gray-50 text-3xl"
        href={routes.logs}
      >
        <Icon name="calendar-outline" width="32" />
      </Link>
      {hasActiveRoutine && (
        <Link
          class="text-primary-900 dark:text-gray-50 ml-4"
          href={routes.activeRoutine}
          aria-label="today's routine"
        >
          <Icon name="barbell-outline" width="28" />
        </Link>
      )}
    </div>
    <nav class="text-primary-900 dark:text-gray-50">
      <Link href={routes.newWorkout}>+</Link>
      <button
        onClick={toggleMenu}
        class={`ml-4 ${style.hamburger}
        ${menuIsOpen ? style.hamburgerActive : ''}`}
      >
        <div class="bg-primary-900 dark:bg-white" />
        <div class="bg-primary-900 dark:bg-white" />
        <div class="bg-primary-900 dark:bg-white" />
      </button>
    </nav>
  </header>
);

export default Header;
