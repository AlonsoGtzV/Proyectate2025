import React, { useState, useEffect } from 'react';
import { StatusBar } from "expo-status-bar";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  Dimensions
} from "react-native";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from './ThemeContext'; // Asegúrate de tener este contexto

export default function HomeScreen({ navigation }) {
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const { darkMode, toggleTheme } = useTheme(); // Obtenemos el tema actual

  const { width, height } = Dimensions.get('window');

  const toggleUnit = (unitIndex) => {
    setExpandedUnit(expandedUnit === unitIndex ? null : unitIndex);
  };

  const handleLockedUnitPress = () => {
    Alert.alert(
      "Unidad bloqueada",
      "Necesitas una llave para acceder a esta unidad.",
      [{ text: "Entendido", style: "default" }]
    );
  };

  const tutorialSteps = [
    {
      id: 'lessons',
      style: { // Contenedor de lecciones
        top: '13%',
        width: '100%',
        height: '20%'
      },
      message: 'Aquí encontrarás tus unidades de aprendizaje disponibles. Puedes tocar una unidad para expandirla y ver las lecciones que contiene.',
    },
    {
      id: 'lockedUnit',
      style: { // Unidad bloqueada
        top:  "23%",
        width: '100%',
        height: '10%'
      },
      message: 'Hay unidades que estarán bloqueadas. Necesitarás una llave para acceder a ellas.',
    },
    {
      id: 'key',
      style: { // Ícono de llave
      },
      message: "Puedes conseguir llaves completando pruebas al final de cada unidad. ¡Intenta completarlas todas para desbloquear todas las unidades!",
    },
    {
      id: 'footerIcon1',
      style: { // Ícono de calendario
        bottom: 4, // Posición desde abajo
        left: 20,   // Posición desde izquierda en pixels
        width: 40,
        height: 40
      },
      message: 'Puedes consultar el glosario de tus actividades desde aquí.',
    },
  
    {
      id: 'footerIcon2',
      style: { // Ícono de estadísticas
        bottom: 4,
        left: '24%',
        width: 40,
        height: 40
      },
      message: 'Revisa tu progreso y estadísticas aquí. También puedes consultar cuántas llaves posees.',
    },
    {
      id: 'footerIcon3',
      style: { // Ícono de chat
        bottom: 4,
        right: '23%',
        width: 40,
        height: 40
      },
      message: 'Desde aquí puedes hablar con Syn, nuestro asistente virtual. Puede resolverte dudas y demás cosas por si las lecciones no te quedan del todo claras.',
    },
    {
      id: 'footerIcon4',
      style: { // Ícono de perfil
        bottom: 4,
        right: '5%',
        width: 40,
        height: 40
      },
      message: 'Configura tu perfil y preferencias. Puedes volver a ver este tutorial desde aquí si lo deseas',
    },
    {
      id: 'footerLogo',
      style: { //Logo de SynSpeech 
        bottom: 4,
        left: '40%',
        width: 80,
        height: 90
      },
      message: 'Y recuerda que siempre puedes tocar el logo para volver a la pantalla de inicio.',
    },
    {
      id: 'farewell',
      style: {   
      },
      message: '¡Eso es todo! Esperamos que disfrutes de tu experiencia de aprendizaje con SynSpeech. ¡Buena suerte!',
    }
  ];

  useEffect(() => {
    const checkTutorial = async () => {
      const hasSeenTutorial = await AsyncStorage.getItem('hasSeenTutorial');
      if (!hasSeenTutorial) {
        setShowTutorial(true);
      }
    };
    checkTutorial();
  }, []);

  const resetTutorial = async () => {
    await AsyncStorage.removeItem('hasSeenTutorial');
    setShowTutorial(true);
    setTutorialStep(0);
  };

  useEffect(() => {
    navigation.setOptions({
      resetTutorial: resetTutorial
    });
  }, [navigation]);

  const handleNextStep = async () => {
    if (tutorialStep < tutorialSteps.length - 1) {
      setTutorialStep(tutorialStep + 1);
    } else {
      setShowTutorial(false);
      await AsyncStorage.setItem('hasSeenTutorial', 'true');
    }
  };

  const calculateTooltipPosition = (stepStyle) => {
    const tooltipStyle = {};
    const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  
    // Calculamos posición vertical
    if (stepStyle.bottom !== undefined) {
      // Elementos en la parte inferior (footer)
      const elementTop = screenHeight - stepStyle.bottom - (stepStyle.height || 0);
      
      // Verificamos si hay espacio arriba del elemento
      if (elementTop > 120) { // 120 = altura aproximada del tooltip
        tooltipStyle.bottom = screenHeight - elementTop + 10;
      } else {
        // Si no hay espacio arriba, colocamos debajo
        tooltipStyle.top = elementTop + (stepStyle.height || 0) + 10;
      }
    } else {
      // Elementos en la parte superior
      tooltipStyle.top = (stepStyle.top || 0) + (stepStyle.height || 0) + 10;
    }
  
    // Calculamos posición horizontal (centrado para el logo)
    if (stepStyle.id === 'footerLogo') {
      tooltipStyle.left = '10%';
      tooltipStyle.right = '10%';
      tooltipStyle.alignItems = 'center'; // Centramos el texto
    } else {
      // Para otros elementos
      if (stepStyle.left !== undefined) {
        tooltipStyle.left = Math.max(10, stepStyle.left - 20);
        tooltipStyle.right = 10;
      } else {
        tooltipStyle.right = Math.max(10, stepStyle.right - 20);
        tooltipStyle.left = 10;
      }
    }
  
    return tooltipStyle;
  };

  // Estilos dinámicos basados en el tema
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? '#121212' : '#EFF0EB',
    },
    header: {
      backgroundColor: darkMode ? '#1E1E1E' : '#2C5E86',
    },
    headerText: {
      color: darkMode ? '#E0E0E0' : 'white',
    },
    activeUnitHeader: {
      backgroundColor: darkMode ? '#1E1E1E' : '#2C5E86',
    },
    unitTitle: {
      color: darkMode ? '#E0E0E0' : 'white',
    },
    lessonContainer: {
      backgroundColor: darkMode ? '#121212' : '#EFF0EB',
    },
    lessonBox: {
      backgroundColor: darkMode ? '#333' : '#83D8E1',
    },
    lessonTitle: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    lessonSubtitle: {
      color: darkMode ? '#BDE4E6' : '#008B8B',
    },
    lockedUnit: {
      backgroundColor: darkMode ? '#1E1E1E' : '#2C5E86',
    },
    lockedText: {
      color: darkMode ? '#E0E0E0' : 'white',
    },
    footer: {
      backgroundColor: darkMode ? '#1E1E1E' : '#BDE4E6',
    },
    footerIcon: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    footerLogoButton: {
      backgroundColor: darkMode ? '#EFF1EC' : '#EFF1EC',
      borderColor: darkMode ? '#555' : '#BDE4E6',
    },
    footerLogo: {
      borderColor: darkMode ? '#555' : '#BDE4E6',
      backgroundColor: darkMode ? '#EFF1EC' : '#EFF1EC',
    },
    tooltipContainer: {
      position: 'absolute',
      backgroundColor: darkMode ? '#333' : 'white',
      padding: 15,
      borderRadius: 10,
      maxWidth: '80%',
      elevation: 5,
      top: '50%', // Centrado vertical
      left: '10%', // Margen desde la izquierda
      right: '10%', // Margen desde la derecha
      transform: [{ translateY: -50 }], // Ajuste para centrar completamente
      alignItems: 'center', // Centrar el contenido horizontalmente
    },
    tooltipText: {
      color: darkMode ? '#E0E0E0' : '#333',
    }
  });

  const renderTutorialOverlay = () => {
    if (!showTutorial) return null;
  
    const currentStep = tutorialSteps[tutorialStep];
  
    const highlightStyle = {
      position: 'absolute',
      backgroundColor: 'rgba(100, 200, 255, 0.5)',
      borderRadius: 10,
      borderWidth: 2,
      borderColor: darkMode ? '#BDE4E6' : '#2C5E86',
      ...currentStep.style,
      left: typeof currentStep.style.left === 'string' ? 
        (width * parseFloat(currentStep.style.left) / 100) : 
        currentStep.style.left,
      right: typeof currentStep.style.right === 'string' ? 
        (width * parseFloat(currentStep.style.right) / 100) : 
        currentStep.style.right,
      top: typeof currentStep.style.top === 'string' ? 
        (height * parseFloat(currentStep.style.top) / 100) : 
        currentStep.style.top,
      bottom: currentStep.style.bottom,
      width: typeof currentStep.style.width === 'string' ?
        (width * parseFloat(currentStep.style.width) / 100) :
        currentStep.style.width,
      height: typeof currentStep.style.height === 'string' ?
        (height * parseFloat(currentStep.style.height) / 100) :
        currentStep.style.height
    };
  
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={StyleSheet.absoluteFill}
        onPress={handleNextStep}
      >
        {/* Capa oscura */}
        <View style={[styles.overlay, { backgroundColor: darkMode ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.7)' }]} />
        
        {/* Área resaltada */}
        <View style={highlightStyle}>
          <View style={[styles.highlightBorder, { borderColor: darkMode ? '#BDE4E6' : 'white' }]} />
        </View>

        {/* Tooltip */}
        <View style={styles.tooltipContainer}>
          <Text style={[styles.tooltipText, dynamicStyles.tooltipText]}>
            {currentStep.message}
          </Text>
          <Text style={styles.tooltipActionText}>Toca para continuar</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Encabezado */}
      <View style={[styles.header, dynamicStyles.header]}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={[styles.logo, dynamicStyles.footerLogo]}
        />
        <Text style={[styles.headerText, dynamicStyles.headerText]}>SynSpeech</Text>
      </View>

      {/* Unidades */}
      <ScrollView style={[styles.lessonContainer, dynamicStyles.lessonContainer]}>
        {units.map((unit, unitIndex) => (
          <View key={unitIndex}>
            <TouchableOpacity
              style={[styles.activeUnitHeader, dynamicStyles.activeUnitHeader]}
              onPress={() => toggleUnit(unitIndex)}
            >
              <Text style={[styles.unitTitle, dynamicStyles.unitTitle]}>{unit.title}</Text>
              <Entypo
                name={expandedUnit === unitIndex ? "chevron-up" : "chevron-down"}
                size={20}
                color={dynamicStyles.unitTitle.color}
              />
            </TouchableOpacity>

            {/* Lecciones */}
            {expandedUnit === unitIndex && (
              <View style={styles.lessonBoxContainer}>
                {unit.lessons.map((lesson, lessonIndex) => (
                  <TouchableOpacity
                    key={lessonIndex}
                    style={[styles.lessonBox, dynamicStyles.lessonBox]}
                    onPress={() => console.log(lesson.title)}
                  >
                    <View style={styles.lessonRow}>
                      <Text style={[styles.lessonTitle, dynamicStyles.lessonTitle]}>{lesson.title}</Text>
                      {React.cloneElement(lesson.icon, { 
                        color: dynamicStyles.lessonTitle.color 
                      })}
                    </View>
                    <Text style={[styles.lessonSubtitle, dynamicStyles.lessonSubtitle]}>{lesson.subtitle}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Unidad bloqueada */}
        <TouchableOpacity
          style={[styles.lockedUnit, dynamicStyles.lockedUnit, { opacity: 0.5 }]}
          onPress={handleLockedUnitPress}
        >
          <Text style={[styles.lockedText, dynamicStyles.lockedText]}>
            Unidad 2. De cero a cien en desarrollo de software
          </Text>
          <Ionicons 
            name="lock-closed" 
            size={20} 
            color={dynamicStyles.lockedText.color} 
          />
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, dynamicStyles.footer]}>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Syllabus")} 
          style={styles.footerIcon1}
        >
          <Ionicons 
            name="calendar" 
            size={24} 
            color={dynamicStyles.footerIcon.color} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("Progress")} 
          style={styles.footerIcon2}
        >
          <Ionicons 
            name="stats-chart" 
            size={24} 
            color={dynamicStyles.footerIcon.color} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={[styles.footerLogoButton, dynamicStyles.footerLogoButton]}
        >
          <Image
            source={require("../assets/Synlogo.png")}
            style={[styles.footerLogo, dynamicStyles.footerLogo]}
          />
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => navigation.navigate("ChatBot")}  
          style={styles.footerIcon3}
        >
          <Ionicons 
            name="chatbubble-ellipses" 
            size={24} 
            color={dynamicStyles.footerIcon.color} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("User")}
          style={styles.footerIcon4}
        >
          <Ionicons 
            name="person-circle" 
            size={26} 
            color={dynamicStyles.footerIcon.color} 
          />
        </TouchableOpacity>
      </View>

      {/* Tutorial Overlay */}
      {renderTutorialOverlay()}
      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}

const units = [
  {
    title: "Unidad 1. Introducción al inglés técnico",
    lessons: [
      {
        title: "1.1 - Empecemos con lo básico",
        subtitle: "¡Aprende vocabulario básico!",
        icon: <Ionicons name="book" size={20} color="white" />,
      },
      {
        title: "1.2 - ¡Leamos un poco!",
        subtitle: "Mejoremos comprensión lectora",
        icon: <Ionicons name="person" size={20} color="white" />,
      },
      {
        title: "1.3 - ¿Qué tal si escuchamos algo?",
        subtitle: "¡Practiquemos con audios reales!",
        icon: <Ionicons name="headset" size={20} color="white" />,
      },
      {
        title: "1.4 - Escribiendo... ¡Completado!",
        subtitle: "Mejoremos comprensión lectora",
        icon: <MaterialIcons name="edit" size={20} color="white" />,
      },
      {
        title: "1.5 - Hora de ponernos a prueba",
        subtitle: "Consigue una llave al completarlo",
        icon: <Ionicons name="key" size={20} color="white" />,
      },
    ],
  },
];

// Tus estilos actualizados
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFF0EB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C5E86",
    padding: 15,
    paddingTop: 50,
    justifyContent: "center",
    gap: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 25,
    backgroundColor: "#EFF1EC",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  activeUnitHeader: {
    backgroundColor: "#2C5E86",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  unitTitle: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
  },
  lessonContainer: {
    padding: 10,
  },
  lessonBoxContainer: {
    marginBottom: 10,
  },
  lessonBox: {
    backgroundColor: "#83D8E1",
    padding: 10,
    borderRadius: 20,
    marginBottom: 10,
  },
  lessonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lessonTitle: {
    fontWeight: "600",
    fontSize: 14,
    color: "#000",
  },
  lessonSubtitle: {
    fontSize: 12,
    color: "#008B8B",
    fontStyle: "italic",
  },
  lockedUnit: {
    backgroundColor: "#2C5E86",
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lockedText: {
    color: "white",
    fontSize: 13,
  },
  footer: {
    height: 50,
    backgroundColor: "#BDE4E6",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  footerIcon1: {
    position: "absolute",
    left: 20,
    bottom: 10,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerIcon2: {
    position: "absolute",
    left: 100,
    bottom: 10,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerIcon3: {
    position: "absolute",
    right: 100,
    bottom: 10, 
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerIcon4: {
    position: "absolute",
    right: 20,
    bottom: 10,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerLogo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#BDE4E6",
  },
  footerLogoButton: {
    position: "absolute",
    top: -40,
    left: "50%",
    transform: [{ translateX: -40 }],
    backgroundColor: "#EFF1EC",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#BDE4E6",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipContainer: {
    position: 'absolute',
    padding: 15,
    borderRadius: 10,
    maxWidth: '80%',
    elevation: 5,
    top: '50%', // Centrado vertical
    left: '10%', // Margen desde la izquierda
    right: '10%', // Margen desde la derecha
    transform: [{ translateY: -50 }], // Ajuste para centrar completamente
    alignItems: 'center', // Centrar el contenido horizontalmente
  },
  tooltipText: {
    fontSize: 16,
    marginBottom: 8,
  },
  tooltipActionText: {
    fontSize: 14,
    color: '#2C5E86',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  highlightArea: {
    position: 'absolute',
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highlightBorder: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 10,
  },
});