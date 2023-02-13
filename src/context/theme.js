import { h } from 'preact'

import { useEffect, useContext, createContext, useState } from 'preact/compat'
import { LOCAL_STORAGE_THEME } from '../config/constants'

const ThemeContext = createContext()

const useTheme = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
  const initialTheme = JSON.parse(localStorage.getItem(LOCAL_STORAGE_THEME))
  let prefersDark = initialTheme === 'dark'
  if (!initialTheme && typeof window !== undefined) {
    prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  }

  const [theme, setTheme] = useState(
    initialTheme ? initialTheme : prefersDark ? 'dark' : 'light',
  ) // dark || light

  useEffect(() => {
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark')
    }
  }, []) // eslint-disable-line

  const toggleThemeMode = () => {
    const newMode = theme === 'light' ? 'dark' : 'light'
    setTheme(newMode)
    localStorage.setItem(LOCAL_STORAGE_THEME, JSON.stringify(newMode))
    // toggle root
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleDarkMode: toggleThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  )
}

export default useTheme
