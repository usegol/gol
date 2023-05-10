import { useState, useEffect } from 'react';

const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const checkDarkMode = () => {
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setIsDarkMode(prefersDarkMode);
    };

    checkDarkMode();
    const listener = window.matchMedia('(prefers-color-scheme: dark)').addListener(checkDarkMode);

    return () => {
      listener.removeListener(checkDarkMode);
    };
  }, []);

  return isDarkMode;
};

export default useDarkMode;
