import { h } from 'preact';

import { menuItems } from '../../config/routes';
import useTheme from '../../context/theme';
import LinkList from '../linkList/LinkList';

import styles from './menu.module.scss';

type Props = {
  isOpen: boolean;
  toggleMenu: () => void;
};

const Menu = ({ isOpen, toggleMenu }: Props) => {
  const { toggleDarkMode, theme } = useTheme();
  return (
    <div
      class={`${styles.menu} fixed inset-0 bg-1 bg-opacity-80 z-10 ${
        isOpen ? styles.active : ''
      }`}
    >
      <div class="max-w-lg mx-auto">
        <LinkList
          links={menuItems.map((item) => ({
            href: item.href,
            text: item.title,
          }))}
        />
        <button
          class="text-lg capitalize no-underline"
          onClick={() => {
            toggleDarkMode();
            toggleMenu();
          }}
        >
          {theme === 'dark' ? 'Turn off dark mode' : 'Dark mode'}
        </button>
      </div>
    </div>
  );
};

export default Menu;
