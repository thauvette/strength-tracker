import { h } from 'preact';
import {
  useState,
  createContext,
  useContext,
  useCallback,
  useEffect,
  createPortal,
} from 'preact/compat';

import Icon from '../../components/icon/Icon';

import generateRandomId from '../../utilities.js/generateRandomId';

interface Toast {
  text: string;
  id?: string;
}

interface ToastContext {
  fireToast: (args: { text: string }) => void;
}

const ToastContext = createContext<ToastContext | null>(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const fireToast = useCallback((toast: Toast) => {
    setToasts((prevState) => [
      ...prevState,
      { ...toast, id: generateRandomId() },
    ]);
  }, []);

  const removeToast = (activeToasts, toast) => {
    setToasts(
      activeToasts.filter((activeToast) => activeToast.id !== toast.id),
    );
  };
  useEffect(() => {
    let timer;
    if (toasts?.length > 0) {
      timer = setTimeout(() => {
        removeToast(toasts, toasts[0]);
      }, 2000);
    }

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [toasts]);

  return (
    <ToastContext.Provider
      value={{
        fireToast,
      }}
    >
      <>
        <Toasts toasts={toasts} removeToast={removeToast} />
        {children}
      </>
    </ToastContext.Provider>
  );
};

const useToast = () => useContext(ToastContext);

const getElement = () => (document ? document.getElementById('app') : null);

const Toasts = ({ toasts, removeToast }) => {
  if (!toasts?.length) {
    return null;
  }

  return createPortal(
    <div class="fixed bottom-0 pt-4 left-2 right-2 z-20">
      {toasts.map((toast) => {
        return (
          <button
            key={toast.id}
            class={`flex items-center justify-between shadow-md mb-2 bg-green-600 text-white p-2 rounded-md text-sm w-full`}
            onClick={() => removeToast(toasts, toast)}
          >
            <p class="m-0">{toast.text}</p>
            <Icon name="close-circle-outline" />
          </button>
        );
      })}
    </div>,
    getElement(),
  );
};

export default useToast;
