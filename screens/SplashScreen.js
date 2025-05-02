import React, { useEffect, useRef } from "react";
import { View, Image, Animated, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function SplashScreen() {
  const navigation = useNavigation();
  const logoPosition = useRef(new Animated.Value(0)).current; // valor inicial

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
    <View style={styles.container}>
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
    backgroundColor: "#EFF1EC",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
  },
});
