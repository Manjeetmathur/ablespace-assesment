'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type ColorMode = 'amber' | 'blue' | 'pink' | 'rose' | 'emerald' | 'black';

interface ThemeColorContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
  theme: string;
  setTheme: (theme: string) => void;
}

const ThemeColorContext = createContext<ThemeColorContextType>({
  colorMode: 'blue',
  setColorMode: () => {},
  theme: 'light',
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<string>('light');
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app_theme') || 'light';
    const savedColor = (localStorage.getItem('app_color_mode') as ColorMode) || 'blue';

    setThemeState(savedTheme);
    setColorModeState(savedColor);

    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-color-mode', savedColor);
  }, []);

  const setTheme = (newTheme: string) => {
    setThemeState(newTheme);
    localStorage.setItem('app_theme', newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem('app_color_mode', mode);
    document.documentElement.setAttribute('data-color-mode', mode);
  };

  return (
    <ThemeColorContext.Provider value={{ colorMode, setColorMode, theme, setTheme }}>
      {children}
    </ThemeColorContext.Provider>
  );
}

export const useAppTheme = () => useContext(ThemeColorContext);
