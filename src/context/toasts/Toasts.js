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

import './toasts.scss';

import generateRandomId from '../../utilities.js/generateRandomId';

const ToastContext = createContext();

// types: success, error, warn??

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const fireToast = useCallback(
    (toast) => {
      setToasts([...toasts, { ...toast, id: generateRandomId() }]);
    },
    [toasts],
  );
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
          <div
            key={toast.id}
            class={` toast ${toast.type || 'success'}`}
            role="button"
            onClick={() => removeToast(toasts, toast)}
          >
            <p class="m-0">{toast.text}</p>
            <Icon name="close-circle-outline" />
          </div>
        );
      })}
    </div>,
    getElement(),
  );
};

export default useToast;
