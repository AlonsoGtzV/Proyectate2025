import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const translations = {
  en: {
    // UserScreen
    profile: "Profile",
    personalInfo: "Personal Information",
    name: "Name",
    email: "Email",
    englishLevel: "English Level",
    selectLevel: "Select your English level...",
    a1: "A1 - Beginner",
    a2: "A2 - Basic",
    b1: "B1 - Intermediate",
    b2: "B2 - Upper Intermediate",
    c1: "C1 - Advanced",
    c2: "C2 - Expert",
    settings: "Settings",
    interfaceLanguage: "Interface Language",
    spanish: "Español",
    english: "English",
    interestArea: "Area of Interest",
    displaySettings: "Display Settings",
    darkMode: "Dark Mode",
    helpSupport: "Help and Support",
    tutorial: "Tutorial",
    support: "Support",
    selectLanguage: "Select a language",
    cancel: "Cancel",
    //HomeScreen
    app_name: "SynSpeech",
    understood: "OK",
    continue: "Continue",
    locked_unit: "Unit 2. From zero to hero in software development",
    tutorial_lessons: "Here you'll find your available learning units. Tap a unit to expand it and see the lessons it contains.",
    tutorial_locked_unit: "Some units will be locked. You'll need a key to access them.",
    tutorial_key: "You can get keys by completing tests at the end of each unit. Try to complete them all to unlock all units!",
    tutorial_calendar: "You can check your activity glossary from here.",
    tutorial_stats: "Check your progress and statistics here. You can also see how many keys you have.",
    tutorial_chat: "From here you can chat with Syn, our virtual assistant. It can answer your questions if the lessons aren't completely clear.",
    tutorial_profile: "Configure your profile and preferences. You can view this tutorial again from here if you want.",
    tutorial_logo: "And remember you can always tap the logo to return to the home screen.",
    tutorial_farewell: "That's all! We hope you enjoy your learning experience with SynSpeech. Good luck!",
    unit_1_title: "Unit 1. Introduction to technical English",
    lesson_1_1: "1.1 - Let's start with the basics",
    lesson_1_1_sub: "Learn basic vocabulary!",
    lesson_1_2: "1.2 - Let's read a bit!",
    lesson_1_2_sub: "Improve reading comprehension",
    lesson_1_3: "1.3 - How about listening to something?",
    lesson_1_3_sub: "Practice with real audio!",
    lesson_1_4: "1.4 - Writing... Completed!",
    lesson_1_4_sub: "Improve reading comprehension",
    lesson_1_5: "1.5 - Time to test ourselves",
    lesson_1_5_sub: "Get a key by completing it",
    locked_unit_alert: 'Unit locked',
    locked_unit_message: "You need a key to access this unit",
  },
  es: {
    // UserScreen
    profile: "Perfil",
    personalInfo: "Información personal",
    name: "Nombre",
    email: "Correo electrónico",
    englishLevel: "Nivel de inglés",
    selectLevel: "Selecciona tu nivel de inglés...",
    a1: "A1 - Principiante",
    a2: "A2 - Básico",
    b1: "B1 - Intermedio",
    b2: "B2 - Intermedio Alto",
    c1: "C1 - Avanzado",
    c2: "C2 - Experto",
    settings: "Ajustes",
    interfaceLanguage: "Idioma de interfaz",
    spanish: "Español",
    english: "English",
    interestArea: "Área de interés",
    displaySettings: "Ajustes de visualización",
    darkMode: "Modo Oscuro",
    helpSupport: "Ayuda y Soporte",
    tutorial: "Tutorial",
    support: "Soporte",
    selectLanguage: "Selecciona un idioma",
    cancel: "Cancelar",
    //HomeScreen
    app_name: "SynSpeech",
    understood: "Entendido",
    continue: "Continuar",
    locked_unit: "Unidad 2. De cero a cien en desarrollo de software",
    tutorial_lessons: "Aquí encontrarás tus unidades de aprendizaje disponibles. Puedes tocar una unidad para expandirla y ver las lecciones que contiene.",
    tutorial_locked_unit: "Hay unidades que estarán bloqueadas. Necesitarás una llave para acceder a ellas.",
    tutorial_key: "Puedes conseguir llaves completando pruebas al final de cada unidad. ¡Intenta completarlas todas para desbloquear todas las unidades!",
    tutorial_calendar: "Puedes consultar el glosario de tus actividades desde aquí.",
    tutorial_stats: "Revisa tu progreso y estadísticas aquí. También puedes consultar cuántas llaves posees.",
    tutorial_chat: "Desde aquí puedes hablar con Syn, nuestro asistente virtual. Puede resolverte dudas y demás cosas por si las lecciones no te quedan del todo claras.",
    tutorial_profile: "Configura tu perfil y preferencias. Puedes volver a ver este tutorial desde aquí si lo deseas.",
    tutorial_logo: "Y recuerda que siempre puedes tocar el logo para volver a la pantalla de inicio.",
    tutorial_farewell: "¡Eso es todo! Esperamos que disfrutes de tu experiencia de aprendizaje con SynSpeech. ¡Buena suerte!",
    unit_1_title: "Unidad 1. Introducción al inglés técnico",
    lesson_1_1: "1.1 - Empecemos con lo básico",
    lesson_1_1_sub: "¡Aprende vocabulario básico!",
    lesson_1_2: "1.2 - ¡Leamos un poco!",
    lesson_1_2_sub: "Mejoremos comprensión lectora",
    lesson_1_3: "1.3 - ¿Qué tal si escuchamos algo?",
    lesson_1_3_sub: "¡Practiquemos con audios reales!",
    lesson_1_4: "1.4 - Escribiendo... ¡Completado!",
    lesson_1_4_sub: "Mejoremos comprensión lectora",
    lesson_1_5: "1.5 - Hora de ponernos a prueba",
    lesson_1_5_sub: "Consigue una llave al completarlo",

  }
};

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('es');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLanguage = async () => {
      try {
        const savedLanguage = await AsyncStorage.getItem('@app_language');
        if (savedLanguage) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLanguage();
  }, []);


  useEffect(() => {
    if (!isLoading) {
      const saveLanguage = async () => {
        try {
          await AsyncStorage.setItem('@app_language', language);
        } catch (error) {
          console.error('Error saving language:', error);
        }
      };

      saveLanguage();
    }
  }, [language, isLoading]);

  const translate = (key) => {
    return translations[language][key] || key;
  };

  if (isLoading) {
    return null; // O un componente de carga si lo prefieres
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, translate }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);