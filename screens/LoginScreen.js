// screens/LoginScreen.js
import { StatusBar } from "expo-status-bar";
import { Text, View, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";
import styles from "../styles/styles";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { darkMode } = useTheme();

  // Estilos dinámicos basados en el tema
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? '#121212' : '#EFF1EC',
    },
    header: {
      backgroundColor: darkMode ? '#121212' : '#2C5E86',
    },
    inputWrapper: {
      backgroundColor: darkMode ? '#333' : '#fff',
      borderColor: darkMode ? '#555' : '#ddd',
    },
    input: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    icon: {
      color: darkMode ? '#BDE4E6' : '#666',
    },
    iconRight: {
      color: darkMode ? '#BDE4E6' : '#666',
    },
    forgotPassword: {
      color: darkMode ? '#83D8E1' : '#2C5E86',
    },
    loginButton: {
      backgroundColor: darkMode ? '#2C5E86' : '#2c6d9e',
    },
    separatorLine: {
      backgroundColor: darkMode ? '#555' : '#ddd',
    },
    separatorText: {
      color: darkMode ? '#E0E0E0' : '#666',
    },
    socialButtonGoogle: {
      backgroundColor: darkMode ? '#333' : '#fff',
      borderColor: darkMode ? '#555' : '#ddd',
    },
    socialButtonApple: {
      backgroundColor: darkMode ? '#333' : '#000',
    },
    socialButtonText: {
      color: darkMode ? '#E0E0E0' : '#666',
    },
    socialButtonappleText: {
      color: darkMode ? '#E0E0E0' : '#fff',
    },
    registerText: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    registeruser: {
      color: darkMode ? '#83D8E1' : '#2C5E86',
    },
    placeholderColor: {
      color: darkMode ? '#999' : '#aaa',
    }
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <Image source={require("../assets/Synlogo.png")} style={styles.logo} />
      </View>

      <View style={styles.inputContainer}>
        <View style={[styles.inputWrapper, dynamicStyles.inputWrapper]}>
          <FontAwesome name="envelope" size={18} style={[styles.icon, dynamicStyles.icon]} />
          <TextInput 
            placeholder="Correo Electrónico" 
            style={[styles.input, dynamicStyles.input]} 
            keyboardType="email-address" 
            placeholderTextColor={dynamicStyles.placeholderColor.color}
          />
        </View>

        <View style={[styles.inputWrapper, dynamicStyles.inputWrapper]}>
          <FontAwesome name="lock" size={18} style={[styles.icon, dynamicStyles.icon]} />
          <TextInput 
            placeholder="Contraseña" 
            style={[styles.input, dynamicStyles.input]} 
            secureTextEntry 
            placeholderTextColor={dynamicStyles.placeholderColor.color}
          />
          <FontAwesome name="eye-slash" size={18} style={[styles.iconRight, dynamicStyles.iconRight]} />
        </View>
      </View>

      <TouchableOpacity>
        <Text style={[styles.forgotPassword, dynamicStyles.forgotPassword]}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.loginButton, dynamicStyles.loginButton]} 
        onPress={() => navigation.navigate("LanguageSelection")}
      >
        <Text style={styles.loginButtonText}>Acceder</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={[styles.separatorLine, dynamicStyles.separatorLine]} />
        <Text style={[styles.separatorText, dynamicStyles.separatorText]}>O</Text>
        <View style={[styles.separatorLine, dynamicStyles.separatorLine]} />
      </View>

      <TouchableOpacity style={[styles.socialButtonGoogle, dynamicStyles.socialButtonGoogle]}>
        <Image source={require("../assets/google.png")} style={styles.socialIcon} />
        <Text style={[styles.socialButtonText, dynamicStyles.socialButtonText]}>Continuar con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.socialButtonApple, dynamicStyles.socialButtonApple]}>
        <Image source={require("../assets/apple.png")} style={styles.socialIcon} />
        <Text style={[styles.socialButtonappleText, dynamicStyles.socialButtonappleText]}>Continuar con Apple</Text>
      </TouchableOpacity>

      <Text style={[styles.registerText, dynamicStyles.registerText]}>¿Usuario nuevo?</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={[styles.registeruser, dynamicStyles.registeruser]}>Regístrate aquí</Text>
      </TouchableOpacity>

      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}