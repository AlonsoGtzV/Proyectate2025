import { StatusBar } from "expo-status-bar";
import { Text, View, Image, TextInput, TouchableOpacity } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Para los iconos en los inputs
import { useNavigation } from "@react-navigation/native"; // Importar navegación
import styles from "../styles/styles";

export default function LoginScreen() {
  const navigation = useNavigation(); // Hook para navegar entre pantallas

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.header}>
        <Image source={require("../assets/Synlogo.png")} style={styles.logo} />
      </View>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <View style={styles.inputWrapper}>
          <FontAwesome name="envelope" size={18} color="#666" style={styles.icon} />
          <TextInput placeholder="Correo Electrónico" style={styles.input} keyboardType="email-address" />
        </View>

        <View style={styles.inputWrapper}>
          <FontAwesome name="lock" size={18} color="#666" style={styles.icon} />
          <TextInput placeholder="Contraseña" style={styles.input} secureTextEntry />
          <FontAwesome name="eye-slash" size={18} color="#666" style={styles.iconRight} />
        </View>
      </View>

      {/* Forgot Password */}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>¿Olvidaste tu contraseña?</Text>
      </TouchableOpacity>

      {/* Botón de acceso */}
      <TouchableOpacity style={styles.loginButton}>
        <Text style={styles.loginButtonText}>Acceder</Text>
      </TouchableOpacity>

      {/* Separador */}
      <View style={styles.separatorContainer}>
        <View style={styles.separatorLine} />
        <Text style={styles.separatorText}>O</Text>
        <View style={styles.separatorLine} />
      </View>

      {/* Botones sociales */}
      <TouchableOpacity style={styles.socialButtonGoogle}>
        <Image source={require("../assets/google.png")} style={styles.socialIcon} />
        <Text style={styles.socialButtonText}>Continuar con Google</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.socialButtonApple}>
        <Image source={require("../assets/apple.png")} style={styles.socialIcon} />
        <Text style={styles.socialButtonappleText}>Continuar con Apple</Text>
      </TouchableOpacity>

      {/* Registro */}
      <Text style={styles.registerText}>¿Usuario nuevo?</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.registeruser}>Regístrate aquí</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}
