import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProgressScreen({ navigation }) {
  const [expandedUnitIndex, setExpandedUnitIndex] = useState(null);

  const units = [
    {
      title: "Unidad 1. Introducción al inglés técnico",
      status: "Desbloqueado",
      progress: "50%",
      lessons: [
        { title: "1.1 - Empecemos con lo básico", progress: "100%" },
        { title: "1.2 - ¡Leamos un poco!", progress: "100%" },
        { title: "1.3 - ¿Qué tal si escuchamos algo?", progress: "0%" },
        { title: "1.4 - Escribiendo... ¡Completado!", progress: "0%" },
        { title: "1.5 - Hora de ponernos a prueba", progress: "Sin realizar" },
      ],
    },
    {
      title: "Unidad 2. De cero a cien en desarrollo de software",
      status: "Bloqueado",
      progress: "0%",
      lessons: [],
    },
  ];

  const toggleExpand = (index) => {
    setExpandedUnitIndex(expandedUnitIndex === index ? null : index);
  };
  
  const keysEarned = units.reduce((count, unit) => {
    if (!unit.lessons) return count;
    return (
      count +
      unit.lessons.filter((lesson) => lesson.progress === "Completado").length
    );
  }, 0);

  const renderLesson = ({ item }) => (
    <View style={styles.lessonContainer}>
      <Text style={styles.lessonTitle}>{item.title}</Text>
      <Text style={styles.lessonProgress}>{item.progress}</Text>
    </View>
  );

  const renderUnit = ({ item, index }) => (
    <View style={styles.unitContainer}>
      <TouchableOpacity onPress={() => toggleExpand(index)} style={styles.unitHeader}>
        <Text style={styles.unitTitle}>{item.title}</Text>
        <Text style={styles.unitProgress}>Progreso: {item.progress}</Text>
        <Ionicons
          name={expandedUnitIndex === index ? "chevron-up" : "chevron-down"}
          size={20}
          color="#000"
        />
      </TouchableOpacity>
      {expandedUnitIndex === index && item.lessons.length > 0 && (
        <FlatList
          data={item.lessons}
          keyExtractor={(lesson) => lesson.title}
          renderItem={renderLesson}
        />
      )}
      {expandedUnitIndex === index && item.lessons.length === 0 && (
        <Text style={styles.lockedText}>Contenido bloqueado</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Progreso</Text>
        <View style={styles.keyContainer}>
          <Ionicons name="key" size={20} color="white" />
          <Text style={styles.keyText}>x {keysEarned}</Text>
        </View>
      </View>

      {/* Expandible por unidades */}
      <FlatList
        data={units}
        keyExtractor={(item) => item.title}
        renderItem={renderUnit}
        contentContainerStyle={styles.listContent}
      />

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={() => navigation.navigate("Syllabus")} style={styles.footerIcon1}>
          <Ionicons name="calendar" size={24} color="#000" />
        </TouchableOpacity>
        <Ionicons name="stats-chart" size={24} color="#000" style={styles.footerIcon2} />
        <TouchableOpacity onPress={() => navigation.navigate("Home")} style={styles.footerLogoButton}>
          <Image source={require("../assets/Synlogo.png")} style={styles.footerLogo} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("ChatBot")} style={styles.footerIcon3}>
          <Ionicons name="chatbubble-ellipses" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("User")} style={styles.footerIcon4}>
          <Ionicons name="person-circle" size={26} color="#000" />
        </TouchableOpacity>
      </View>
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
  headerText: { color: "white", fontSize: 22, fontWeight: "bold" },
  listContent: { padding: 15 },
  unitContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
  },
  keyContainer: {
    position: "absolute", 
    right: 15,           
    flexDirection: "row",
    alignItems: "center",
    top: 63
  },
  keyText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  unitCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    elevation: 3,
  },
  unitHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  unitTitle: { fontSize: 16, fontWeight: "bold", flex: 1 },
  unitProgress: { marginRight: 10, fontWeight: "bold", color: "#2C5E86" },
  lessonContainer: {
    paddingLeft: 15,
    paddingVertical: 5,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  lessonTitle: { fontSize: 14, color: "#333" },
  lessonProgress: { fontSize: 14, fontWeight: "600", color: "#555" },
  lockedText: { marginTop: 10, color: "gray", fontStyle: "italic", textAlign: "center" },
  footer: {
    height: 50,
    backgroundColor: "#BDE4E6",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  footerIcon1: { position: "absolute", left: 20, bottom: 10 },
  footerIcon2: { position: "absolute", left: 100, bottom: 10 },
  footerIcon3: { position: "absolute", right: 100, bottom: 10 },
  footerIcon4: { position: "absolute", right: 20, bottom: 10 },
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
