import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, ActivityIndicator, Image } from 'react-native';
const translations = {
  us: {
    common: {
      loading: "Loading...",
      cancel: "Cancel",
      email: "Email",
      name: "Name",
      continue: "Continue",
      understood: "OK",
      back:"Back",
    },
    user: {
      profile: "Profile",
      personalInfo: "Personal Information",
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
      spanish: "Spanish",
      english: "English",
      interestArea: "Area of Interest",
      displaySettings: "Display Settings",
      darkMode: "Dark Mode",
      helpSupport: "Help and Support",
      tutorial: "Tutorial",
      support: "Support",
      selectLanguage: "Select a language",
      save: "Save changes",
      emailPlaceholder: "Email address",
    },
    home: {
      app_name: "SynSpeech",
      unit_1_title_software: "Unit 1: Software Fundamentals",
      unit_2_title_software: "Unit 2: Programming",
      unit_3_title_software: "Unit 3: Tools and Practices",
      unit_1_title_electronics: "Unit 1: Electronics Fundamentals",
      unit_2_title_electronics: "Unit 2: Circuits",
      unit_3_title_electronics: "Unit 3: Instrumentation",
      locked_unit_alert: "Unit locked",
      locked_unit_message: "You need a key to access this unit",
      unlock_success_title: "Unit unlocked",
      unlock_success_message: "¡You have unlocked this unit successfully!",
      unlock_error_title: "Error unlocking",
      unlock_error_message: "There was an error trying to unlock the unit",
      not_enough_keys: "You don't have enough keys to unlock this unit",
    },
    tutorial: {
      lessons: "Here you'll find your available learning units. Tap a unit to expand it and see the lessons it contains.",
      locked_unit: "Some units will be locked. You'll need a key to access them.",
      key: "You can get keys by completing tests at the end of each unit. Try to complete them all to unlock all units!",
      calendar: "You can check your activity glossary from here.",
      stats: "Check your progress and statistics here. You can also see how many keys you have.",
      chat: "From here you can chat with Syn, our virtual assistant. It can answer your questions if the lessons aren't completely clear.",
      profile: "Configure your profile and preferences. You can view this tutorial again from here if you want.",
      logo: "And remember you can always tap the logo to return to the home screen.",
      farewell: "That's all! We hope you enjoy your learning experience with SynSpeech. Good luck!",
    },
    progress: {
      title: "Progress",
      completed: "Completed",
      blocked_unit: "Blocked unit",
      content_not_available: "Content not available",
      not_done: "Not done",
    },
    chat: {
      message: "Hello! I'm Syn. I'm here to help you learn technical English. 😊",
      type: "Write a message...",
      info1: "Syn can make mistakes.",
      info2: "Be kind when chatting",
    },
    lesson: {
      preparing: "Preparing lesson...",
      loading: "Loading content...",
      almost_ready: "Almost ready...",
      title: "Lesson",
      untitled_lesson: "Untitled Lesson",
      detailed_explanation: "Detailed Explanation",
      vocabulary: "Vocabulary",
      start_quiz: "Start Quiz",
      quiz: "Quiz",
      quiz_completed: "Quiz Completed!",
      score: "Score",
      try_again: "Try Again",
      lesson_not_found: "Lesson not found",
      success: "Congratulations!",
      completed_message: "You have completed this lesson!"
    },
    auth: {
      login: "Login",
      register: "Register",
      email: "Email address",
      password: "Password",
      repeatPassword: "Repeat password",
      birthday: "Choose your birthday",
      username: "Username",
      forgotPassword: "Forgot password?",
      newUser: "New user?",
      signUp: "Sign up",
      haveAccount: "Already have an account?",
      haveAccount2: "Log in",
      passwordLength: "Password must be between 8 and 16 characters long",
      passwordUpper: "Password must contain at least one uppercase letter",
      passwordSymbol: "Password must contain at least one special character",
      passwordError1: "Your password doesn't meet the requirements.",
      passwordError2: "Passwords do not match.",
      welcome1: "Sign up successful",
      welcome2: "Welcome to SynSpeech!",
    },
    support: {
      title: "Support",
      question: "How can we help you?",
      instructions: "Please describe the problem in as much detail as possible. This will help us understand what's happening.",
      emailPlaceholder: "Email address",
      subjectPlaceholder: "Subject",
      descriptionPlaceholder: "Description",
      addPhoto: "Add photo (optional)",
      photoSelected: "Photo selected",
      send: "Send request",
      sentTitle: "Message sent",
      sentMessage: "You will receive a response in your inbox shortly.",
      problems: [
        "Select a problem...",
        "Technical issue",
        "Access problem",
        "Content issue",
        "Suggestions",
        "Other",
      ],
      permissionDeniedTitle: "Permission denied",
      permissionDeniedMessage: "We can't access your gallery without your permission.",
    },
    loading: {
      bridgeToEnglish: "Professional English, your bridge to success"
    },
    test: {
      loading: "Loading questions...",
      locked_message: "Complete all lessons to access the final test",
      no_questions: {
        title: "No questions",
        message: "No questions available for this unit"
      },
      not_enough_questions: {
        title: "Not enough questions",
        message: "There are not enough questions available for the test"
      },
      load_error: "Could not load questions",
      question: "Question",
      of: "of",
      completed: "Test Completed!",
      score: "Score",
      success: "Congratulations!",
      key_earned: "You have earned a key!",
      back: "Back",
      try_again: "Try Again"
    },
  },
  es: {
    common: {
      loading: "Cargando...",
      cancel: "Cancelar",
      email: "Correo electrónico",
      name: "Nombre",
      continue: "Continuar",
      understood: "Entendido",
      back:"Volver",
    },
    user: {
      profile: "Perfil",
      personalInfo: "Información personal",
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
      english: "Inglés",
      interestArea: "Área de interés",
      displaySettings: "Ajustes de visualización",
      darkMode: "Modo Oscuro",
      helpSupport: "Ayuda y Soporte",
      tutorial: "Tutorial",
      support: "Soporte",
      selectLanguage: "Selecciona un idioma",
      save: "Guardar cambios",
      emailPlaceholder: "Correo electrónico",
    },
    home: {
      app_name: "SynSpeech",
      unit_1_title_software: "Unidad 1: Fundamentos de Software",
      unit_2_title_software: "Unidad 2: Programación",
      unit_3_title_software: "Unidad 3: Herramientas y Prácticas",
      unit_1_title_electronics: "Unidad 1: Fundamentos de Electrónica",
      unit_2_title_electronics: "Unidad 2: Circuitos",
      unit_3_title_electronics: "Unidad 3: Instrumentación",
      locked_unit_alert: "Unidad bloqueada",
      locked_unit_message: "Necesitas una llave para acceder a esta unidad",
      unlock_success_title: "Unidad desbloqueada",
      unlock_success_message: "¡Has desbloqueado esta unidad exitosamente!",
      unlock_error_title: "Error al desbloquear",
      unlock_error_message: "Ocurrió un error al intentar desbloquear la unidad",
      not_enough_keys: "No tienes suficientes llaves para desbloquear esta unidad",
    },
    tutorial: {
      lessons: "Aquí encontrarás tus unidades de aprendizaje disponibles. Puedes tocar una unidad para expandirla y ver las lecciones que contiene.",
      locked_unit: "Hay unidades que estarán bloqueadas. Necesitarás una llave para acceder a ellas.",
      key: "Puedes conseguir llaves completando pruebas al final de cada unidad. ¡Intenta completarlas todas para desbloquear todas las unidades!",
      calendar: "Puedes consultar el glosario de tus actividades desde aquí.",
      stats: "Revisa tu progreso y estadísticas aquí. También puedes consultar cuántas llaves posees.",
      chat: "Desde aquí puedes hablar con Syn, nuestro asistente virtual. Puede resolverte dudas y demás cosas por si las lecciones no te quedan del todo claras.",
      profile: "Configura tu perfil y preferencias. Puedes volver a ver este tutorial desde aquí si lo deseas.",
      logo: "Y recuerda que siempre puedes tocar el logo para volver a la pantalla de inicio.",
      farewell: "¡Eso es todo! Esperamos que disfrutes de tu experiencia de aprendizaje con SynSpeech. ¡Buena suerte!",
    },
    progress: {
      title: "Progreso",
      completed: "Completado",
      blocked_unit: "Unidad bloqueada",
      content_not_available: "Contenido no disponible",
      not_done: "Sin realizar",
    },
    chat: {
      message: "¡Hola! Soy Syn. Estoy aquí para ayudarte a aprender inglés técnico. 😊",
      type: "Escribe un mensaje...",
      info1: "Syn puede cometer errores.",
      info2: "Sé amable al chatear",
    },
    lesson: {
      preparing: "Preparando lección...",
      loading: "Cargando contenido...",
      almost_ready: "Casi listo...",
      title: "Lección",
      untitled_lesson: "Lección sin título",
      detailed_explanation: "Explicación Detallada",
      vocabulary: "Vocabulario",
      start_quiz: "Comenzar Quiz",
      quiz: "Quiz",
      quiz_completed: "¡Quiz Completado!",
      score: "Puntaje",
      try_again: "Intentar de Nuevo",
      lesson_not_found: "Lección no encontrada",
      success: "¡Felicitaciones!",
      completed_message: "¡Has completado esta lección!"
    },
    auth: {
      login: "Acceder",
      register: "Registrarse",
      email: "Correo electrónico",
      password: "Contraseña",
      repeatPassword: "Repite la contraseña",
      birthday: "Selecciona tu fecha de nacimiento",
      username: "Nombre de usuario",
      forgotPassword: "¿Olvidaste tu contraseña?",
      newUser: "¿Nuevo usuario?",
      signUp: "Regístrate aquí",
      haveAccount: "¿Ya tienes una cuenta?",
      haveAccount2: "Inicia sesión",
      passwordLength: "La contraseña debe tener entre 8 y 16 caracteres",
      passwordUpper: "Debe contener al menos una letra mayúscula",
      passwordSymbol: "Debe contener al menos un carácter especial",
      passwordError1: "Tu contraseña no cumple con los requisitos.",
      passwordError2: "Las contraseñas no coinciden.",
    },
    support: {
      title: "Soporte",
      question: "¿Cómo podemos ayudarte?",
      instructions: "Por favor, describe el problema con tantos detalles como puedas. Nos ayudará a entender mejor qué es lo que ocurre.",
      emailPlaceholder: "Dirección de correo electrónico",
      subjectPlaceholder: "Asunto",
      descriptionPlaceholder: "Descripción",
      addPhoto: "Agregar foto (opcional)",
      photoSelected: "Foto seleccionada",
      send: "Enviar petición",
      sentTitle: "Mensaje enviado",
      sentMessage: "Espera una respuesta pronto en tu bandeja de entrada.",
      problems: [
        "Seleccione un problema...",
        "Problema técnico",
        "Problema de acceso",
        "Problema de contenido",
        "Sugerencias",
        "Otros",
      ],
      permissionDeniedTitle: "Permiso denegado",
      permissionDeniedMessage: "No podemos acceder a tu galería sin tu permiso.",
    },
    loading: {
      bridgeToEnglish: "Tu puente al inglés profesional"
    },
    test: {
      loading: "Cargando preguntas...",
      locked_message: "Completa todas las lecciones de la unidad para desbloquear el test",
      no_questions: {
        title: "Sin preguntas",
        message: "No hay preguntas disponibles para esta unidad"
      },
      not_enough_questions: {
        title: "Preguntas insuficientes",
        message: "No hay suficientes preguntas disponibles para el test"
      },
      load_error: "No se pudieron cargar las preguntas",
      question: "Pregunta",
      of: "de",
      completed: "¡Test Completado!",
      score: "Puntaje",
      success: "¡Felicitaciones!",
      key_earned: "¡Has conseguido una llave!",
      back: "Volver",
      try_again: "Intentar de Nuevo"
    },
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

  const translate = (key) => {
    const [namespace, translationKey] = key.includes('.') ? key.split('.') : ['common', key];
    return translations[language]?.[namespace]?.[translationKey] || key;
  };

  if (isLoading) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#2C5E86' }}>
          <Image source={require('../assets/Synlogo.png')} style={{ width: 80, height: 80, marginBottom: 20 }} />
          <Text style={{ color: 'white', fontSize: 18 }}>{translate('common.loading')}</Text>
          <ActivityIndicator size="large" color="#BDE4E6" />
        </View>
    );
  }

  return (
      <LanguageContext.Provider value={{ language, setLanguage, translate, isLoading }}>
        {children}
      </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);