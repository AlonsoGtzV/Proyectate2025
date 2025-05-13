import { StatusBar } from "expo-status-bar";
import React from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  TextInput, 
  Switch 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTutorial } from "./TutorialContext";
import { useTheme } from "./ThemeContext";

export default function Screen({ navigation }) {
  const { resetTutorial } = useTutorial();
  const { darkMode, toggleTheme } = useTheme();

  const handleTutorialPress = async () => {
    await resetTutorial();
    navigation.navigate("Home");
  };

  // Estilos dinámicos completos
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
    footer: {
      backgroundColor: darkMode ? '#1E1E1E' : '#BDE4E6',
    },
    input: {
      backgroundColor: darkMode ? '#333' : '#fff',
      color: darkMode ? '#fff' : '#333',
      borderColor: darkMode ? '#555' : '#ccc',
    },
    label: {
      color: darkMode ? '#E0E0E0' : '#333',
    },
    sectionTitle: {
      color: darkMode ? '#E0E0E0' : '#333',
    },
    button: {
      backgroundColor: darkMode ? '#2C5E86' : '#2C5E86',
    },
    buttonText: {
      color: darkMode ? '#E0E0E0' : '#fff',
    },
    footerIcon: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    footerLogoButton: {
      backgroundColor: darkMode ? '#EFF1EC' : '#EFF1EC',
      borderColor: darkMode ? '#555' : '#BDE4E6',
    },
    scrollContent: {
      backgroundColor: darkMode ? '#121212' : '#EFF0EB',
    },
    placeholderText: {
      color: darkMode ? '#999' : '#ccc',
    },
    footerLogo: {
      borderColor: darkMode ? '#555' : '#BDE4E6',
    }
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Encabezado */}
      <View style={[styles.header, dynamicStyles.header]}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={[styles.logo, { 
            backgroundColor: darkMode ? '#EFF1EC' : '#EFF1EC' 
          }]}
        />
        <Text style={[styles.headerText, dynamicStyles.headerText]}>Perfil</Text>
      </View>

      <ScrollView
        style={styles.lessonContainer}
        contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollContent]}
      >
        {/* Personal Info */}
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Información personal
        </Text>
        <TextInput 
          placeholder="Nombre"
          placeholderTextColor={dynamicStyles.placeholderText.color}
          style={[styles.input, dynamicStyles.input]} 
        />
        <TextInput 
          placeholder="Correo electrónico"
          placeholderTextColor={dynamicStyles.placeholderText.color}
          style={[styles.input, dynamicStyles.input]} 
        />

        {/* User Settings */}
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Ajustes
        </Text>
        <TextInput 
          placeholder="Idioma de interfaz"
          placeholderTextColor={dynamicStyles.placeholderText.color}
          style={[styles.input, dynamicStyles.input]} 
        />
        <TextInput 
          placeholder="Área de interés"
          placeholderTextColor={dynamicStyles.placeholderText.color}
          style={[styles.input, dynamicStyles.input]} 
        />

        {/* Notification Settings */}
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Ajustes de notificaciones
        </Text>
        <View style={styles.row}>
          <Text style={[styles.label, dynamicStyles.label]}>
            Recordatorios de estudio
          </Text>
          <Switch 
            value={true} 
            thumbColor={darkMode ? '#2C5E86' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: darkMode ? '#BDE4E6' : '#81b0ff' }}
          />
        </View>

        {/* Visualization Settings */}
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Ajustes de visualización
        </Text>
        <View style={styles.row}>
          <Text style={[styles.label, dynamicStyles.label]}>
            Modo Oscuro
          </Text>
          <Switch 
            value={darkMode} 
            onValueChange={toggleTheme}
            thumbColor={darkMode ? '#2C5E86' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#BDE4E6' }}
          />
        </View>

        {/* Buttons */}
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          Ayuda y Soporte
        </Text>
        <TouchableOpacity 
          style={[styles.button, dynamicStyles.button]} 
          onPress={handleTutorialPress}
        >
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
            Tutorial
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, dynamicStyles.button]}
          onPress={() => navigation.navigate("Support")}
        >
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
            Soporte
          </Text>
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
      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}

// Estilos base (sin colores fijos para permitir sobreescritura)
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 25,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  footer: {
    height: 50,
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
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
  },
  button: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
});