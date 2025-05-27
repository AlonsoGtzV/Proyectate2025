import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";
import { useToken } from "../services/TokenContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ProgressScreen({ navigation }) {
  const [expandedUnitIndex, setExpandedUnitIndex] = useState(null);
  const [units, setUnits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keysCount, setKeysCount] = useState(0);
  const [userData, setUserData] = useState(null); // Nuevo estado para userData

  const { darkMode } = useTheme();
  const { translate } = useLanguage();
  const { token } = useToken();


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
    lessonItem: {
      backgroundColor: darkMode ? '#2A2A2A' : '#f8f9fa',
    },
    lessonDescription: {
      color: darkMode ? '#999' : '#666',
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
    unitContainer: {
      backgroundColor: darkMode ? "#1E1E1E" : "#FFFFFF",
    },
    unitTitle: {
      color: darkMode ? "#E0E0E0" : "#333",
    },
    unitProgress: {
      color: darkMode ? "#BDE4E6" : "#2C5E86",
    },
    lessonTitle: {
      color: darkMode ? "#CCCCCC" : "#333",
    },
    lessonProgress: {
      color: darkMode ? "#AAAAAA" : "#555",
    },
    lockedText: {
      color: darkMode ? "#888" : "gray",
    }
  });

  const fetchProgress = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const userResponse = await fetch(`http://10.0.2.2:8080/api/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = await userResponse.json();

      setKeysCount(userData.keys || 0);

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

      const area = userData.specificArea || "Software";
      const baseUnits = baseUnitsByArea[area] || baseUnitsByArea.Software;

      const lessonsResponse = await fetch(`http://10.0.2.2:8080/api/lessons/filter?languagePreference=${userData.languagePreference}&specificArea=${area}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const lessons = await lessonsResponse.json();

      const lessonsByUnit = {};
      lessons.forEach(lesson => {
        const unitId = lesson.unit || 1;
        if (!lessonsByUnit[unitId]) lessonsByUnit[unitId] = [];
        lessonsByUnit[unitId].push(lesson);
      });

      const processedUnits = baseUnits.map(baseUnit => ({
        ...baseUnit,
        lessons: lessonsByUnit[baseUnit.id] || [],
      }));

      setUnits(processedUnits);
      setUserData(userData);
      setLoading(false);
    } catch (error) {
      console.error('Error al cargar progreso:', error);
      setLoading(false);
    }
  };

// Primer useEffect para la carga inicial
  useEffect(() => {
    fetchProgress();
  }, [token, translate]);

// Segundo useEffect para actualizar al enfocar la pantalla
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchProgress();
    });

    return unsubscribe;
  }, [navigation, token]);

  if (loading) {
    return (
        <View style={[styles.loadingContainer, dynamicStyles.container]}>
          <ActivityIndicator size="large" color={darkMode ? '#4A90E2' : '#2C5E86'} />
        </View>
    );
  }


  return (
      <View style={[styles.container, dynamicStyles.container]}>
        <View style={[styles.header, dynamicStyles.header]}>
          <Image
              source={require("../assets/Synlogo.png")}
              style={[styles.logo, dynamicStyles.logo]}
          />
          <Text style={[styles.headerText, dynamicStyles.headerText]}>
            {translate('progress.title')}
          </Text>
          <View style={styles.keysContainer}>
            <Ionicons name="key" size={24} color="white" />
            <Text style={styles.keysText}>{keysCount}</Text>
          </View>
        </View>

        {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={darkMode ? '#4A90E2' : '#2C5E86'} />
            </View>
        ) : (
            <FlatList
                data={units}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item, index }) => (
                    <View style={[styles.unitContainer, dynamicStyles.unitContainer]}>
                      <TouchableOpacity
                          onPress={() => setExpandedUnitIndex(expandedUnitIndex === index ? null : index)}
                          style={styles.unitHeader}
                      >
                        <Text style={[styles.unitTitle, dynamicStyles.unitTitle]}>
                          {item.unitTitle}
                        </Text>
                        <Ionicons
                            name={expandedUnitIndex === index ? "chevron-up" : "chevron-down"}
                            size={24}
                            color="white"
                        />
                      </TouchableOpacity>
                      {expandedUnitIndex === index && (
                          <View style={styles.lessonsContainer}>
                            {item.lessons.map((lesson, lessonIndex) => (
                                <View key={lessonIndex} style={[styles.lessonItem, dynamicStyles.lessonItem]}>
                                  <Text style={[styles.lessonTitle, dynamicStyles.lessonTitle]}>
                                    {lesson.lessonContent.title}
                                  </Text>
                                  <Text style={[styles.lessonProgress, dynamicStyles.lessonProgress]}>
                                    {userData?.completedLessons?.some(completed => completed.lessonId === lesson.id)
                                        ? translate('progress.completed')
                                        : translate('progress.pending')}
                                  </Text>
                                </View>
                            ))}
                          </View>
                      )}
                    </View>
                )}
            />
        )}

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
          </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C5E86",
    padding: 15,
    paddingTop: 50,
    paddingBottom: 20,
    marginBottom: 15,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 25,
    marginRight: 10,
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
    flex: 1,
  },
  keysContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  keysText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
  },
  unitContainer: {
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 12,
    overflow: "hidden",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  unitHeader: {
    backgroundColor: "#2C5E86",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  unitTitle: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  lessonItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0, 0, 0, 0.1)",
  },
  lessonInfo: {
    flex: 1,
    marginRight: 10,
  },
  lessonTitle: {
    fontSize: 15,
    fontWeight: "500",
    marginBottom: 4,
  },
  lessonDescription: {
    fontSize: 13,
    color: "#666",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  lockedText: {
    textAlign: 'center',
    padding: 15,
    fontStyle: 'italic',
  }
});


