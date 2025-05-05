import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function HomeScreen({ navigation }) {
  const [expandedUnit, setExpandedUnit] = useState(null);

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

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>SYNSPEECH</Text>
      </View>

      {/* Unidades */}
      <ScrollView style={styles.lessonContainer}>
        {units.map((unit, unitIndex) => (
          <View key={unitIndex}>
            <TouchableOpacity
              style={styles.activeUnitHeader}
              onPress={() => toggleUnit(unitIndex)}
            >
              <Text style={styles.unitTitle}>{unit.title}</Text>
              <Entypo
                name={expandedUnit === unitIndex ? "chevron-up" : "chevron-down"}
                size={20}
                color="white"
              />
            </TouchableOpacity>

            {/* Lecciones */}
            {expandedUnit === unitIndex && (
              <View style={styles.lessonBoxContainer}>
                {unit.lessons.map((lesson, lessonIndex) => (
                  <TouchableOpacity
                    key={lessonIndex}
                    style={styles.lessonBox}
                    onPress={() => console.log(lesson.title)}
                  >
                    <View style={styles.lessonRow}>
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      {lesson.icon}
                    </View>
                    <Text style={styles.lessonSubtitle}>{lesson.subtitle}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}

        {/* Unidad bloqueada */}
        <TouchableOpacity
          style={[styles.lockedUnit, { opacity: 0.5 }]}
          onPress={handleLockedUnitPress}
        >
          <Text style={styles.lockedText}>
            Unidad 2. De cero a cien en desarrollo de software
          </Text>
          <Ionicons name="lock-closed" size={20} color="white" />
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="calendar" size={24} color="#000" style={styles.footerIcon1} />
        <Ionicons name="stats-chart" size={24} color="#000" style={styles.footerIcon2} />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.footerLogoButton}
        >
          <Image
            source={require("../assets/Synlogo.png")}
            style={styles.footerLogo}
          />
        </TouchableOpacity>
        <Ionicons name="chatbubble-ellipses" size={24} color="#000" style={styles.footerIcon3} />
        <TouchableOpacity
          onPress={() => navigation.navigate("User")}
          style={styles.footerIcon4}
        >
          <Ionicons name="person-circle" size={26} color="#000" />
        </TouchableOpacity>
      </View>
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
});
