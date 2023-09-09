import { h } from 'preact';
import { Link } from 'preact-router/match';
import { route } from 'preact-router';
import dayjs from 'dayjs';
import { routes } from '../../config/routes';
import Icon from '../icon/Icon';
import style from './style.scss';
import dateFormats from '../../config/dateFormats';
import { HydratedSet } from 'src/context/db/types';

interface Props {
  toggleMenu: () => void;
  menuIsOpen: boolean;
  activeRoutine?: HydratedSet[];
}
const Header = ({ toggleMenu, menuIsOpen, activeRoutine }: Props) => {
  const goHome = () => {
    route(`${routes.logs}?date=${dayjs().format(dateFormats.day)}`);
  };

  return (
    <header class="flex items-center justify-between px-4 h-14 bg-2 z-20">
      <div class="flex items-center">
        <button
          class="text-primary-900 dark:text-gray-50 text-3xl"
          onClick={goHome}
        >
          <Icon name="calendar-outline" width="32" />
        </button>
        {activeRoutine && (
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
};

export default Header;
