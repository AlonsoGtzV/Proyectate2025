// TutorialContext.js
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TutorialContext = createContext();

export const TutorialProvider = ({ children }) => {
  const [showTutorial, setShowTutorial] = useState(false);

  const resetTutorial = async () => {
    await AsyncStorage.removeItem('hasSeenTutorial');
    setShowTutorial(true);
  };

  return (
    <TutorialContext.Provider value={{ showTutorial, setShowTutorial, resetTutorial }}>
      {children}
    </TutorialContext.Provider>
  );
};

export const useTutorial = () => useContext(TutorialContext);