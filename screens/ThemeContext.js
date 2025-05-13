// ThemeContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(false);

  // Cargar preferencia guardada al iniciar
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('@themePreference');
        if (savedTheme !== null) {
          setDarkMode(savedTheme === 'dark');
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadThemePreference();
  }, []);

  // Guardar preferencia cuando cambie
  useEffect(() => {
    const saveThemePreference = async () => {
      try {
        await AsyncStorage.setItem(
          '@themePreference',
          darkMode ? 'dark' : 'light'
        );
      } catch (error) {
        console.error('Error saving theme:', error);
      }
    };
    
    saveThemePreference();
  }, [darkMode]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);