import { h } from 'preact';
import { route } from 'preact-router';
import { menuItems, routes } from '../../config/routes';
import useTheme from '../../context/theme';
import LinkList from '../linkList/LinkList';
import useAuthContext from '../../context/supabase/auth';

type Props = {
  isOpen: boolean;
  toggleMenu: () => void;
};

const Menu = ({ isOpen, toggleMenu }: Props) => {
  const { toggleDarkMode, theme } = useTheme();
  const { isAuthenticated, logout } = useAuthContext();

  return (
    <div
      class={`transition z-[1] fixed inset-0 bg-1 bg-opacity-80 z-10 transform ${
        isOpen ? ` translate-y-[54px]` : '-translate-y-full'
      }`}
    >
      <div class="max-w-lg mx-auto flex flex-col pb-[64px] h-full">
        <LinkList
          links={menuItems.map((item) => ({
            href: item.href,
            text: item.title,
          }))}
        />
        <button
          class="text-lg capitalize no-underline text-left"
          onClick={() => {
            toggleDarkMode();
            toggleMenu();
          }}
        >
          {theme === 'dark' ? 'Turn off dark mode' : 'Dark mode'}
        </button>
        <button
          class="mt-auto"
          onClick={() => {
            if (isAuthenticated) {
              logout();
            } else {
              route(routes.authentication);
            }
            toggleMenu();
          }}
        >
          {isAuthenticated ? 'Sign out' : 'Login/Sign Up'}
        </button>
      </div>
    </div>
  );
};

export default Menu;
