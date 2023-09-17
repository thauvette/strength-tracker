import { h } from 'preact';
import { useLayoutEffect, useRef } from 'preact/compat';

const ClickAwayHandler = ({ children, onClickAway }) => {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const current = ref?.current;
    const checkEvent = (e) => {
      if (!ref?.current?.contains(e.target) && onClickAway) {
        onClickAway();
      }
    };
    if (current && typeof window !== 'undefined') {
      window.addEventListener('click', checkEvent);
    }

    return () => {
      if (current && typeof window !== 'undefined') {
        window.removeEventListener('click', checkEvent);
      }
    };
  }, [onClickAway]);

  return <div ref={ref}>{children}</div>;
};

export default ClickAwayHandler;
