import React, { useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from './ThemeContext';


export default function RegisterScreen() {
  const { darkMode } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const navigation = useNavigation(); // Hook para la navegación

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setBirthday(date.toLocaleDateString());
    hideDatePicker();
  };

  const handleSignUp = () => {
    console.log({ username, email, password, repeatPassword, birthday });
    Alert.alert("Registro exitoso", "¡Bienvenido a SynSpeech!");
    navigation.navigate("Login"); // Navegar a la pantalla de inicio de sesión después del registro
  };

  // Estilos dinámicos basados en el tema
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? '#121212' : '#EFF1EC',
    },
    input: {
      backgroundColor: darkMode ? '#333' : '#fff',
      borderColor: darkMode ? '#555' : '#ccc',
      color: darkMode ? '#E0E0E0' : '#000',
    },
    button: {
      backgroundColor: darkMode ? '#2C5E86' : '#2c6d9e',
    },
    buttonText: {
      color: '#fff', // Se mantiene igual en ambos modos
    },
    loginText: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    loginLink: {
      color: darkMode ? '#83D8E1' : '#007bff',
    },
    dateText: {
      color: darkMode ? (birthday ? '#E0E0E0' : '#999') : (birthday ? '#000' : '#aaa'),
    },
    placeholderColor: {
      color: darkMode ? '#999' : '#aaa',
    }
  });

  return (
    <ScrollView contentContainerStyle={[styles.container, dynamicStyles.container]}>
      <Image
        source={require('../assets/Synlogo.png')}
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="Nombre de usuario"
        placeholderTextColor={dynamicStyles.placeholderColor.color}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="Correo electrónico"
        placeholderTextColor={dynamicStyles.placeholderColor.color}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="Contraseña"
        placeholderTextColor={dynamicStyles.placeholderColor.color}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder="Repetir contraseña"
        placeholderTextColor={dynamicStyles.placeholderColor.color}
        secureTextEntry
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />

      <TouchableOpacity onPress={showDatePicker} style={[styles.input, dynamicStyles.input]}>
        <Text style={dynamicStyles.dateText}>
          {birthday || 'Selecciona tu fecha de nacimiento'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        themeVariant={darkMode ? 'dark' : 'light'}
      />

      <TouchableOpacity style={[styles.button, dynamicStyles.button]} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, dynamicStyles.loginText]}>
          ¿Ya tienes una cuenta?{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.loginLink, dynamicStyles.loginLink]}>Inicia sesión</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style={darkMode ? "light" : "dark"} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#EFF1EC',
  },
  logo: {
    width: 200,
    height: 200,
    marginBottom: 30,
    marginTop: 40,
  },
  input: {
    width: '100%',
    padding: 12,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2c6d9e',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginVertical: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  loginText: {
    fontSize: 14,
  },
  loginLink: {
    fontWeight: "bold",
  },
});