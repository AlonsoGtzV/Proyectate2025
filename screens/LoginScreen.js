import { StatusBar } from "expo-status-bar";
import { Text, View, Image, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";
import styles from "../styles/styles";
import { useState } from "react";
import { useLanguage } from "./LanguageContext";
import {Animated} from 'react-native';
import {useEffect, useRef} from 'react';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { darkMode } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const { translate } = useLanguage();
  const logoAnim = useRef(new Animated.Value(-100)).current; // empieza arriba
const formOpacity = useRef(new Animated.Value(0)).current; // empieza invisible
const buttonAnim = useRef(new Animated.Value(100)).current; // empieza abajo
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");



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
            placeholder={translate("email")} 
            style={[styles.input, dynamicStyles.input]} 
            keyboardType="email-address" 
             value={email}
  onChangeText={setEmail}
            placeholderTextColor={dynamicStyles.placeholderColor.color}
          />
        </View>

        <View style={[styles.inputWrapper, dynamicStyles.inputWrapper]}>
          <FontAwesome name="lock" size={18} style={[styles.icon, dynamicStyles.icon]} />
          <TextInput 
            placeholder={translate("password")}
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
  onPress={() => {
    console.log("Email:", email);
    console.log("Password:", password);
    navigation.navigate("LanguageSelection");
  }}
>
  <Text style={styles.loginButtonText}>{translate("login")}</Text>
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