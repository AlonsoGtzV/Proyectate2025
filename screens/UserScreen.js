import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Switch,
} from "react-native";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";

export default function Screen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Perfil</Text>
      </View>

      <ScrollView
        style={styles.lessonContainer}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Personal Info */}
        <Text style={styles.sectionTitle}>Información personal</Text>
        <TextInput placeholder="Nombre" style={styles.input} />
        <TextInput placeholder="Correo electrónico" style={styles.input} />

        {/* User Settings */}
        <Text style={styles.sectionTitle}>Ajustes</Text>
        <TextInput placeholder="Idioma de interfaz" style={styles.input} />
        <TextInput placeholder="Área de interés" style={styles.input} />

        {/* Notification Settings */}
        <Text style={styles.sectionTitle}>Ajustes de notificaciones</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Recordatorios de estudio</Text>
          <Switch value={true} />
        </View>

        {/* Visualization Settings */}
        <Text style={styles.sectionTitle}>Ajustes de vizualización</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Modo Oscuro</Text>
          <Switch value={false} />
        </View>

        {/* Buttons */}
        <Text style={styles.sectionTitle}>Ayuda y Soporte</Text>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Tutorial</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Support")}
        >
          <Text style={styles.buttonText}>Soporte</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Syllabus")}
          style={styles.footerIcon1}
        >
          <Ionicons name="calendar" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Progress")}
          style={styles.footerIcon2}
        >
          <Ionicons name="stats-chart" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.footerLogoButton}
        >
          <Image
            source={require("../assets/Synlogo.png")}
            style={styles.footerLogo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChatBot")}
          style={styles.footerIcon3}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#000" />
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF0EB",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C5E86",
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
  footer: {
    height: 50,
    backgroundColor: "#BDE4E6",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
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
  lessonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileImage: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginBottom: 20,
  },
  addIcon: {
    position: "absolute",
    bottom: 5,
    right: "40%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 2,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#2C5E86",
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});