import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "./ThemeContext"; // Asegúrate de tener esto
import { StatusBar } from "expo-status-bar";
import { useLanguage } from "./LanguageContext";
import { useToken } from "../services/TokenContext";


export default function Syllabus({ navigation }) {
  const [units, setUnits] = useState([]);
  const [expandedUnit, setExpandedUnit] = useState(null);
  const [loading, setLoading] = useState(true);
  const { translate } = useLanguage();
  const { darkMode } = useTheme();
  const { token } = useToken();

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const userId = await AsyncStorage.getItem('userId');
        if (!userId || !token) {
          setUnits([]);
          setLoading(false);
          return;
        }

        // Obtener usuario
        const userRes = await fetch(`http://10.0.2.2:8080/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!userRes.ok) throw new Error('Error al obtener usuario');
        const user = await userRes.json();

        const unlockedUnits = user.unlockedUnits;
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
        setUnits([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, translate]);

  const toggleUnit = (index) => {
    setExpandedUnit(expandedUnit === index ? null : index);
  };

  // Estilos dinámicos según el tema
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? "#121212" : "#f1f3ee",
    },
    header: {
      backgroundColor: darkMode ? "#1E1E1E" : "#2C5E86",
    },
    headerText: {
      color: darkMode ? "#E0E0E0" : "white",
    },
    unitContainer: {
      backgroundColor: darkMode ? "#2C2C2C" : "#d9d9d9",
    },
    unitTitle: {
      color: darkMode ? "#E0E0E0" : "#000",
    },
    topicList: {
      backgroundColor: darkMode ? "#333" : "#4b9eac",
    },
    topicText: {
      color: "#fff",
    },
    footer: {
      backgroundColor: darkMode ? "#1E1E1E" : "#BDE4E6",
    },
    footerIcon: {
      color: darkMode ? "#E0E0E0" : "#000",
    },
    footerLogoButton: {
      backgroundColor: darkMode ? "#333" : "#EFF1EC",
      borderColor: darkMode ? "#555" : "#BDE4E6",
    },
    footerLogo: {
      borderColor: darkMode ? "#555" : "#BDE4E6",
      backgroundColor: darkMode ? "#EFF1EC" : "#EFF1EC",
    },
  });

  if (loading) {
    return (
        <View style={[styles.container, dynamicStyles.container, { flex: 1, justifyContent: 'center', alignItems: 'center' }]}>
          <ActivityIndicator size="large" color={darkMode ? "#BDE4E6" : "#2C5E86"} />
        </View>
    );
  }

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <Image source={require("../assets/Synlogo.png")} style={[styles.logo, dynamicStyles.footerLogo]} />
        <Text style={[styles.headerText, dynamicStyles.headerText]}>Syllabus</Text>
      </View>

      {/* Lista */}
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {units.map((unit, index) => (
            <View key={unit.id} style={[styles.unitContainer, dynamicStyles.unitContainer]}>
              <TouchableOpacity style={styles.unitHeader} onPress={() => toggleUnit(index)}>
                <Ionicons
                    name={expandedUnit === index ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={dynamicStyles.unitTitle.color}
                    style={{ marginRight: 10 }}
                />
                <Text style={[styles.unitTitle, dynamicStyles.unitTitle]}>{unit.unitTitle}</Text>
                {unit.locked && (
                    <Ionicons name="lock-closed" size={18} color="#888" style={{ marginLeft: 10 }} />
                )}
              </TouchableOpacity>
              {expandedUnit === index && (
                  <View style={[styles.topicList, dynamicStyles.topicList]}>
                    {unit.lessons.length === 0 ? (
                        <Text style={[styles.topicText, dynamicStyles.topicText]}>{translate('no_lessons')}</Text>
                    ) : (
                        unit.lessons.map((lesson, i) => (
                            <View key={lesson.id || i} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                              <Ionicons name="book" size={18} color="#fff" style={{ marginRight: 8 }} />
                              <Text style={[styles.topicText, dynamicStyles.topicText]}>{lesson.lessonContent?.title || translate('lesson')}</Text>
                            </View>
                        ))
                    )}
                  </View>
              )}
            </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View style={[styles.footer, dynamicStyles.footer]}>
        <TouchableOpacity onPress={() => navigation.navigate("Syllabus")} style={styles.footerIcon1}>
          <Ionicons name="calendar" size={24} color={dynamicStyles.footerIcon.color} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Progress")} style={styles.footerIcon2}>
          <Ionicons name="stats-chart" size={24} color={dynamicStyles.footerIcon.color} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={[styles.footerLogoButton, dynamicStyles.footerLogoButton]}
        >
          <Image source={require("../assets/Synlogo.png")} style={[styles.footerLogo, dynamicStyles.footerLogo]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ChatBot")} style={styles.footerIcon3}>
          <Ionicons name="chatbubble-ellipses" size={24} color={dynamicStyles.footerIcon.color} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("User")} style={styles.footerIcon4}>
          <Ionicons name="person-circle" size={26} color={dynamicStyles.footerIcon.color} />
        </TouchableOpacity>
      </View>
      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
    justifyContent: "center",
    gap: 10,
    width: "100%",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    borderRadius: 25,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  unitContainer: {
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
  },
  unitHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  unitTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  topicList: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
  },
  topicText: {
    fontSize: 14,
    marginBottom: 5,
  },
  footer: {
    height: 50,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  footerIcon1: {
    position: "absolute",
    left: 20,
    bottom: 10,
  },
  footerIcon2: {
    position: "absolute",
    left: 100,
    bottom: 10,
  },
  footerIcon3: {
    position: "absolute",
    right: 100,
    bottom: 10,
  },
  footerIcon4: {
    position: "absolute",
    right: 20,
    bottom: 10,
  },
  footerLogo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 40,
    borderWidth: 2,
  },
  footerLogoButton: {
    position: "absolute",
    top: -40,
    left: "50%",
    transform: [{ translateX: -40 }],
    borderRadius: 40,
    borderWidth: 2,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
});
