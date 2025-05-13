import React, { useEffect, useRef } from "react";
import { View, Image, Animated, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";

export default function SplashScreen() {
  const { darkMode, toogleTheme } = useTheme();
  const navigation = useNavigation();
  const logoPosition = useRef(new Animated.Value(0)).current; // valor inicial

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? "#121212" : "#EFF1EC",
    },
  });
  useEffect(() => {
    Animated.timing(logoPosition, {
      toValue: -260, // coincide con la posición del LoginScreen
      duration: 1500,
      useNativeDriver: true,
    }).start(() => {
      navigation.replace("Login"); // cuando termine la animación
    });
  }, []);

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <Animated.Image
        source={require("../assets/Synlogo.png")}
        style={[
          styles.logo,
          {
            transform: [{ translateY: logoPosition }],
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
