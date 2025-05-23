import { StatusBar } from "expo-status-bar";
import { Text, View, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";
import styles from "../styles/styles";
import { useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLanguage } from "./LanguageContext";
import {Animated} from 'react-native';
import {useEffect, useRef} from 'react';
import { useToken } from "../TokenContext";

export default function LoginScreen() {
  const navigation = useNavigation();
  const { translate } = useLanguage();
  const logoAnim = useRef(new Animated.Value(-100)).current; // empieza arriba
  const formOpacity = useRef(new Animated.Value(0)).current; // empieza invisible
  const buttonAnim = useRef(new Animated.Value(100)).current;
  const { darkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setToken } = useToken();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Por favor ingresa usuario y contraseña');
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:8080/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        throw new Error('Usuario o contraseña incorrectos');
      }
      const token = await response.text();
      await AsyncStorage.setItem('token', token);
      setToken(token);
      await AsyncStorage.setItem('userData', JSON.stringify({
        username
      }));
      setLoading(false);
      navigation.navigate('Home'); // Cambia 'Home' por la pantalla principal de tu app
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', error.message);
    }
  };

useEffect(() => {
  Animated.sequence([
    Animated.timing(logoAnim, {
      toValue: 0,
      duration: 800,
      useNativeDriver: true,
    }),
    Animated.parallel([
      Animated.timing(formOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(buttonAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]),
  ]).start();
}, []);


  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? '#121212' : '#EFF1EC',
    },
    header: {
      backgroundColor: darkMode ? '#121212' : '#EFF1EC',
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
        <Animated.Image
  source={require("../assets/Synlogo.png")}
  style={[
    styles.logo,
    { transform: [{ translateY: logoAnim }] }
  ]}
/>

      </View>

      <View style={styles.inputContainer}>
        <View style={[styles.inputWrapper, dynamicStyles.inputWrapper]}>
          <FontAwesome name="envelope" size={18} style={[styles.icon, dynamicStyles.icon]} />

          <TextInput
              style={styles.input}
              placeholder="Usuario"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
          />
        </View>

        <View style={[styles.inputWrapper, dynamicStyles.inputWrapper]}>
          <FontAwesome name="lock" size={18} style={[styles.icon, dynamicStyles.icon]} />

          <TextInput
              placeholder="Contraseña"
              style={[styles.input, dynamicStyles.input]}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={dynamicStyles.placeholderColor.color}

          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome
                name={showPassword ? "eye" : "eye-slash"}
                size={18}
                style={[styles.iconRight, dynamicStyles.iconRight]}
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity>
        <Text style={[styles.forgotPassword, dynamicStyles.forgotPassword]}>{translate("forgotPassword")}</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.loginButton, dynamicStyles.loginButton]} 
        onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Acceder</Text>
      </TouchableOpacity>

      <View style={styles.separatorContainer}>
        <View style={[styles.separatorLine, dynamicStyles.separatorLine]} />
        <Text style={[styles.separatorText, dynamicStyles.separatorText]}>O</Text>
        <View style={[styles.separatorLine, dynamicStyles.separatorLine]} />
      </View>

      <Text style={[styles.registerText, dynamicStyles.registerText]}>{translate("newUser")}</Text>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={[styles.registeruser, dynamicStyles.registeruser]}>{translate("signUp")}</Text>
      </TouchableOpacity>

      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}