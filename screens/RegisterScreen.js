import React, { useState } from 'react';
import { StatusBar } from "expo-status-bar";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, StyleSheet, Alert} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';


export default function RegisterScreen() {
  const { darkMode } = useTheme();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const { translate } = useLanguage();

  const navigation = useNavigation(); // Hook para la navegación

  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);
  const handleConfirm = (date) => {
    setBirthday(date.toLocaleDateString());
    hideDatePicker();
  };

  const validatePassword = (value) => {
  const lengthValid = value.length >= 8 && value.length <= 16;
  const hasUppercase = /[A-Z]/.test(value);
  const hasSymbol = /[^A-Za-z0-9]/.test(value);

  return { lengthValid, hasUppercase, hasSymbol };
  };

  const requirements = validatePassword(password);


  const handleSignUp = () => {
    const { lengthValid, hasUppercase, hasSymbol } = validatePassword(password);

  if (!lengthValid || !hasUppercase || !hasSymbol) {
    setPasswordError(translate("auth.passwordError1"));
    return;
  }

  if (password !== repeatPassword) {
    setPasswordError(translate("auth.passwordError2"));
    return;
  }

  setPasswordError('');
    navigation.navigate("SpecialtySelection", {
      username,
      email,
      password,
      repeatPassword,
      birthday
    }); 
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
        placeholder= {translate("auth.username")}
        placeholderTextColor={dynamicStyles.placeholderColor.color}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder={translate("auth.email")}
        placeholderTextColor={dynamicStyles.placeholderColor.color}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder={translate("auth.password")}
        placeholderTextColor={dynamicStyles.placeholderColor.color}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <View style={styles.requirementsContainer}>
        <Text
          style={[
            styles.requirementText,
            { color: requirements.lengthValid ? "green" : "red" }
          ]}
        >
          • {translate("auth.passwordLength")}
        </Text>
        <Text
          style={[
            styles.requirementText,
            { color: requirements.hasUppercase ? "green" : "red" }
          ]}
        >
          • {translate("auth.passwordUpper")}
        </Text>
        <Text
          style={[
            styles.requirementText,
            { color: requirements.hasSymbol ? "green" : "red" }
          ]}
        >
          • {translate("auth.passwordSymbol")}
        </Text>
      </View>

      {passwordError !== '' && (
        <Text style={styles.errorText}>{passwordError}</Text>
      )}

      <TextInput
        style={[styles.input, dynamicStyles.input]}
        placeholder={translate("auth.repeatPassword")}
        placeholderTextColor={dynamicStyles.placeholderColor.color}
        secureTextEntry
        value={repeatPassword}
        onChangeText={setRepeatPassword}
      />

      <TouchableOpacity onPress={showDatePicker} style={[styles.input, dynamicStyles.input]}>
        <Text style={dynamicStyles.dateText}>
          {birthday || translate("auth.birthday")}
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
        <Text style={styles.buttonText}>{translate("auth.register")}</Text>
      </TouchableOpacity>

      <View style={styles.loginContainer}>
        <Text style={[styles.loginText, dynamicStyles.loginText]}>
          {translate("auth.haveAccount")}{' '}
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={[styles.loginLink, dynamicStyles.loginLink]}>{translate("auth.haveAccount2")}</Text>
        </TouchableOpacity>
      </View>
      <StatusBar style={darkMode ? "light" : "dark"} />
    </ScrollView>
  )
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
  requirementsContainer: {
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  requirementText: {
    fontSize: 12,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'left',
    width: '100%',
  },
});