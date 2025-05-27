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
import { useToken } from "../services/TokenContext";

export default function HomeScreen({ navigation }) {
  const [units, setUnits] = useState([]);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [completedLessons, setCompletedLessons] = useState([]);
  const { darkMode, toggleTheme } = useTheme();
  const { translate } = useLanguage();
  const { width, height } = Dimensions.get('window');
  const { token } = useToken();

  const handleLockedUnitPress = async (unitId) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const response = await fetch(`http://10.0.2.2:8080/api/users/${userId}/unlock-unit/${unitId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          unitId: unitId
        })
      });

      const data = await response.json();

      if (response.ok) {
        // Actualizar el estado local de las unidades
        setUnits(prevUnits => prevUnits.map(unit =>
          unit.id === unitId ? { ...unit, locked: false } : unit
        ));
        Alert.alert(
          translate('home.unlock_success_title'),
          translate('home.unlock_success_message')
        );
      } else {
        Alert.alert(
          translate('home.unlock_error_title'),
          data.message || translate('home.not_enough_keys')
        );
      }
    } catch (error) {
      console.error('Error al desbloquear unidad:', error);
      Alert.alert(
        translate('common.error'),
        translate('home.unlock_error_message')
      );
    }
  };

  // Función para obtener datos del backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        if (!userId || !token) {
          setUnits(fallbackUnits);
          setLoading(false);
          return;
        }

        // Obtener usuario
        const userRes = await fetch(`http://10.0.2.2:8080/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error('Error al obtener usuario');
        const user = await userRes.json();

        setCompletedLessons(user.completedLessons || []);

        const baseUnitsByArea = {
          Software: [
            { id: 1, unitTitle: translate('home.unit_1_title_software') },
            { id: 2, unitTitle: translate('home.unit_2_title_software') },
            { id: 3, unitTitle: translate('home.unit_3_title_software') },
          ],
          Electronics: [
            { id: 1, unitTitle: translate('home.unit_1_title_electronics') },
            { id: 2, unitTitle: translate('home.unit_2_title_electronics') },
            { id: 3, unitTitle: translate('home.unit_3_title_electronics') },
          ],
        };

        const unlockedUnits = user.unlockedUnits;

        // Selecciona las unidades base según el área
        const area = user.specificArea || "Software";
        const baseUnits = baseUnitsByArea[area] || baseUnitsByArea.Software;

        // Obtener lecciones
        const filters = {
          languagePreference: user.languagePreference,
          specificArea: user.specificArea,
        };
        const params = new URLSearchParams(filters).toString();
        const lessonsRes = await fetch(`http://10.0.2.2:8080/api/lessons/filter?${params}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!lessonsRes.ok) throw new Error('Error al obtener lecciones');
        const lessons = await lessonsRes.json();

        const lessonsByUnit = {};
        lessons.forEach(lesson => {
          const unitId = lesson.unit || 1;
          if (!lessonsByUnit[unitId]) lessonsByUnit[unitId] = [];
          lessonsByUnit[unitId].push(lesson);
        });

        const processedUnits = baseUnits.map((unit) => ({
          ...unit,
          locked: !unlockedUnits.includes(unit.id),
          lessons: lessonsByUnit[unit.id] || [],
        }));

        setUnits(processedUnits);
      } catch (error) {
        setUnits(fallbackUnits);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, translate]);



  const toggleUnit = (unitIndex) => {
    setExpandedUnit(expandedUnit === unitIndex ? null : unitIndex);
  };

  const getLessonIcon = (iconType, color = "white") => {
    switch (iconType) {
      case 'book': return <Ionicons name="book" size={20} color={color} />;
      case 'person': return <Ionicons name="person" size={20} color={color} />;
      case 'headset': return <Ionicons name="headset" size={20} color={color} />;
      case 'edit': return <MaterialIcons name="edit" size={20} color={color} />;
      case 'key': return <Ionicons name="key" size={20} color={color} />;
      case 'code-slash': return <Ionicons name="code-slash" size={20} color={color} />;
      case 'developer-mode': return <MaterialIcons name="developer-mode" size={20} color={color} />;
      case 'rocket': return <Ionicons name="rocket" size={20} color={color} />;
      default: return <Ionicons name="book" size={20} color={color} />;
    }
  };

  const tutorialSteps = [
    {
      id: 'lessons',
      style: { top: '13%', width: '100%', height: '20%' },
      message: translate('tutorial.lessons'),
    },
    {
      id: 'lockedUnit',
      style: { top: "23%", width: '100%', height: '10%' },
      message: translate('tutorial.locked_unit'),
    },
    {
      id: 'key',
      style: {},
      message: translate('tutorial.key'),
    },
    {
      id: 'footerIcon1',
      style: { bottom: 4, left: 20, width: 40, height: 40 },
      message: translate('tutorial.calendar'),
    },
    {
      id: 'footerIcon2',
      style: { bottom: 4, left: '24%', width: 40, height: 40 },
      message: translate('tutorial.stats'),
    },
    {
      id: 'footerIcon3',
      style: { bottom: 4, right: '23%', width: 40, height: 40 },
      message: translate('tutorial.chat'),
    },
    {
      id: 'footerIcon4',
      style: { bottom: 4, right: '5%', width: 40, height: 40 },
      message: translate('tutorial.profile'),
    },
    {
      id: 'footerLogo',
      style: { bottom: 4, left: '40%', width: 80, height: 90 },
      message: translate('tutorial.logo'),
    },
    {
      id: 'farewell',
      style: {},
      message: translate('tutorial.farewell'),
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
    },
    finalTestButton: {
        backgroundColor: darkMode ? '#4A90E2' : '#2C5E86',
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
            <Text style={styles.tooltipActionText}>{translate('common.continue')}</Text>
          </View>
        </TouchableOpacity>
    );
  };

  if (loading) {
    return (
        <View style={[styles.container, dynamicStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <Text style={[styles.headerText, { color: darkMode ? '#E0E0E0' : '#2C5E86' }]}>
            {translate('common.loading') || 'Cargando...'}
          </Text>
        </View>
    );
  }

  return (
      <View style={[styles.container, dynamicStyles.container]}>
        {/* Encabezado */}
        <View style={[styles.header, dynamicStyles.header]}>
          <Image
              source={require("../assets/Synlogo.png")}
              style={[styles.logo, dynamicStyles.footerLogo]}
          />
          <Text style={[styles.headerText, dynamicStyles.headerText]}>{translate('home.app_name')}</Text>
        </View>

        {/* Unidades */}
        <ScrollView style={styles.lessonContainer}>
          {units.map((unit, unitIndex) => (
              <View key={unit.id} style={styles.lessonBoxContainer}>
                <TouchableOpacity
                    style={[
                      styles.activeUnitHeader,
                      unit.locked && { opacity: 0.5 },
                    ]}
                    onPress={() => {
                      if (unit.locked) {
                        handleLockedUnitPress(unit.id);
                      } else {
                        setExpandedUnit(expandedUnit === unitIndex ? null : unitIndex);
                      }
                    }}
                >
                  <Text style={styles.unitTitle}>
                    {unit.unitTitle}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    {unit.locked && (
                        <Ionicons name="lock-closed" size={20} color="#fff" />
                    )}
                    <Entypo
                        name={expandedUnit === unitIndex ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#fff"
                    />
                  </View>
                </TouchableOpacity>

                {!unit.locked && expandedUnit === unitIndex && (
                    <View>
                      {unit.lessons.length === 0 ? (
                          <Text style={styles.lessonSubtitle}>
                            {translate('no_lessons')}
                          </Text>
                      ) : (
                          <>
                            {unit.lessons.map((lesson, idx) => (
                                <TouchableOpacity
                                    key={lesson.id || idx}
                                    style={styles.lessonBox}
                                    onPress={() => navigation.navigate("Loading", { lesson })}
                                >
                                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    {getLessonIcon(lesson.iconType)}
                                    <Text style={styles.lessonTitle}>
                                      {lesson.lessonContent.title}
                                    </Text>
                                  </View>
                                  <Text style={styles.lessonSubtitle}>
                                    {lesson.lessonContent.text}
                                  </Text>
                                </TouchableOpacity>
                            ))}
                            {completedLessons.length >= unit.lessons.length &&
                            unit.lessons.every(lesson =>
                                completedLessons.some(completed =>
                                    completed.lessonId === lesson.id
                                )
                            ) ? (
                                <TouchableOpacity
                                    style={[styles.finalTestButton, dynamicStyles.finalTestButton]}
                                    onPress={() => navigation.navigate("FinalTest", { unitId: unit.id })}
                                >
                                  <Ionicons name="trophy" size={24} color={darkMode ? '#E0E0E0' : '#fff'} />
                                  <Text style={styles.finalTestText}>Test Final</Text>
                                </TouchableOpacity>
                            ) : (
                                <View style={styles.testLockedContainer}>
                                  <Text style={[styles.testLockedText, dynamicStyles.text]}>
                                    {translate('test.locked_message')}
                                  </Text>
                                  <Ionicons name="lock-closed" size={20} color={darkMode ? '#E0E0E0' : '#333'} />
                                </View>
                            )}
                          </>
                      )}
                    </View>
                )}
              </View>
          ))}
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
  finalTestButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#2C5E86',
      padding: 15,
      borderRadius: 10,
      marginTop: 10,
      marginBottom: 15,
      gap: 10,
  },
  finalTestText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
  },
  testLockedContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 15,
      marginTop: 10,
      marginBottom: 15,
      gap: 10,
      opacity: 0.7,
  },
  testLockedText: {
      fontSize: 14,
      textAlign: 'center',
      fontStyle: 'italic',
  },
});