import { useEffect, useRef } from 'preact/hooks';
const useOnMount = (callback: () => void) => {
  const ref = useRef(false);
  useEffect(() => {
    if (!ref.current) {
      callback();
      ref.current = true;
    }
  });
};

export default useOnMount;
