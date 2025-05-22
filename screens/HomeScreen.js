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
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';
import { useToken} from "../TokenContext";

export default function HomeScreen({ navigation }) {
  const [units, setUnits] = useState([]);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const { darkMode, toggleTheme } = useTheme();
  const { translate } = useLanguage();
  const { width, height } = Dimensions.get('window');
  const { token } = useToken();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) return;
        // 1. Obtener usuario
        const userRes = await fetch(`http://10.0.2.2:8080/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const user = await userRes.json();
        // 2. Armar filtros según usuario
        const filters = {
          englishLevel: user.englishLevel,
          languagePreference: user.languagePreference,
          specificArea: user.specificArea,
          professionalismLevel: user.professionalismLevel
        };
        // 3. Obtener lecciones
        const params = new URLSearchParams(filters).toString();
        const lessonsRes = await fetch(`http://10.0.2.2:8080/api/lessons/filter?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        const data = await lessonsRes.json();
        // 4. Guardar unidades dinámicas
        // Suponiendo que la API responde con [{ unitTitle, lessons: [{ title, subtitle, iconType }] }]
        setUnits(data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      }
    };
    if (token) fetchData();
  }, [token]);

  const toggleUnit = (unitIndex) => {
    setExpandedUnit(expandedUnit === unitIndex ? null : unitIndex);
  };

  const handleLockedUnitPress = () => {
    Alert.alert(
      translate('locked_unit_alert'),
      translate('locked_unit_message'),
      [{ text: translate('understood'), style: "default" }]
    );
  };

  const getLessonIcon = (iconType) => {
    switch (iconType) {
      case 'book': return <Ionicons name="book" size={20} color="white" />;
      case 'person': return <Ionicons name="person" size={20} color="white" />;
      case 'headset': return <Ionicons name="headset" size={20} color="white" />;
      case 'edit': return <MaterialIcons name="edit" size={20} color="white" />;
      case 'key': return <Ionicons name="key" size={20} color="white" />;
      default: return <Ionicons name="book" size={20} color="white" />;
    }
  };

  const tutorialSteps = [
    {
      id: 'lessons',
      style: { top: '13%', width: '100%', height: '20%' },
      message: translate('tutorial_lessons'),
    },
    {
      id: 'lockedUnit',
      style: { top: "23%", width: '100%', height: '10%' },
      message: translate('tutorial_locked_unit'),
    },
    {
      id: 'key',
      style: {},
      message: translate('tutorial_key'),
    },
    {
      id: 'footerIcon1',
      style: { bottom: 4, left: 20, width: 40, height: 40 },
      message: translate('tutorial_calendar'),
    },
    {
      id: 'footerIcon2',
      style: { bottom: 4, left: '24%', width: 40, height: 40 },
      message: translate('tutorial_stats'),
    },
    {
      id: 'footerIcon3',
      style: { bottom: 4, right: '23%', width: 40, height: 40 },
      message: translate('tutorial_chat'),
    },
    {
      id: 'footerIcon4',
      style: { bottom: 4, right: '5%', width: 40, height: 40 },
      message: translate('tutorial_profile'),
    },
    {
      id: 'footerLogo',
      style: { bottom: 4, left: '40%', width: 80, height: 90 },
      message: translate('tutorial_logo'),
    },
    {
      id: 'farewell',
      style: {},
      message: translate('tutorial_farewell'),
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

    if (stepStyle.bottom !== undefined) {
      const elementTop = screenHeight - stepStyle.bottom - (stepStyle.height || 0);
      if (elementTop > 120) {
        tooltipStyle.bottom = screenHeight - elementTop + 10;
      } else {
        tooltipStyle.top = elementTop + (stepStyle.height || 0) + 10;
      }
    } else {
      tooltipStyle.top = (stepStyle.top || 0) + (stepStyle.height || 0) + 10;
    }

    if (stepStyle.id === 'footerLogo') {
      tooltipStyle.left = '10%';
      tooltipStyle.right = '10%';
      tooltipStyle.alignItems = 'center';
    } else {
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
      top: '50%',
      left: '10%',
      right: '10%',
      transform: [{ translateY: -50 }],
      alignItems: 'center',
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
          <Text style={styles.tooltipActionText}>{translate('continue')}</Text>
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
          <Text style={[styles.headerText, dynamicStyles.headerText]}>{translate('app_name')}</Text>
        </View>

        {/* Unidades dinámicas */}
        <ScrollView style={[styles.lessonContainer, dynamicStyles.lessonContainer]}>
          {units.map((unit, unitIndex) => (
              <View key={unitIndex}>
                <TouchableOpacity
                    style={[styles.activeUnitHeader, dynamicStyles.activeUnitHeader]}
                    onPress={() => toggleUnit(unitIndex)}
                >
                  <Text style={[styles.unitTitle, dynamicStyles.unitTitle]}>{unit.unitTitle}</Text>
                  <Entypo
                      name={expandedUnit === unitIndex ? "chevron-up" : "chevron-down"}
                      size={20}
                      color={dynamicStyles.unitTitle.color}
                  />
                </TouchableOpacity>
                {expandedUnit === unitIndex && (
                    <View style={styles.lessonBoxContainer}>
                      {unit.lessons.map((lesson, lessonIndex) => (
                          <TouchableOpacity
                              key={lessonIndex}
                              style={[styles.lessonBox, dynamicStyles.lessonBox]}
                              onPress={() => navigation.navigate('LessonRender', { lesson })}
                          >
                                <View style={styles.lessonRow}>
                              <Text style={[styles.lessonTitle, dynamicStyles.lessonTitle]}>{lesson.lessonContent.title}</Text>
                                  </View>
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
              {translate('locked_unit')}
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
    top: '50%',
    left: '10%',
    right: '10%',
    transform: [{ translateY: -50 }],
    alignItems: 'center',
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