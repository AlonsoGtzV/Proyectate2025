import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from "@react-navigation/native";

export default function RegisterScreen() {
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

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require('../assets/Synlogo.png')} // Ajusta esta ruta según la ubicación de tu logo
        style={styles.logo}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder="Nombre de usuario"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Repetir contraseña"
        secureTextEntry
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />

      <TouchableOpacity onPress={showDatePicker} style={styles.input}>
        <Text style={{ color: birthday ? '#000' : '#aaa' }}>
          {birthday || 'Selecciona tu fecha de nacimiento'}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        ¿Ya tienes una cuenta?{' '}
        </Text>
      <TouchableOpacity style = {styles.login} onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginLink}>Inicia sesión</Text>
      </TouchableOpacity>
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
  loginText: {
    fontSize: 14,
    textAlign: "center", // Asegura que el texto esté centrado
    flexDirection: "row", // Alinea los elementos en una fila
  },
  loginLink: {
    color: "#007bff",
    fontWeight: "bold",
    marginTop: 3
  },
});