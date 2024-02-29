import { useEffect } from 'react';

export const useAppHeight = () => {
  const setHeight = () => {
    const root = document.getElementById('root');
    if (root) {
      const windowHeight = window.innerHeight;
      root.style.height = `${windowHeight}px`;
    }
  };

  useEffect(() => {
    setHeight();
    window.addEventListener('resize', setHeight);
    return () => window.removeEventListener('resize', setHeight);
  }, []);

  return null;
};
