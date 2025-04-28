import React from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from "react-native";

const RegisterScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image source={require("../assets/Synlogo.png")} style={styles.logo} />

      {/* Inputs */}
      <TextInput style={styles.input} placeholder="Full Name" />
      <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry />
      <TextInput style={styles.input} placeholder="Repeat Password" secureTextEntry />

      {/* Birthday */}
      <Text style={styles.label}>Birthday:</Text>
      <View style={styles.birthdayContainer}>
        <TextInput style={styles.birthdayInput} placeholder="DD" keyboardType="numeric" />
        <TextInput style={styles.birthdayInput} placeholder="MM" keyboardType="numeric" />
        <TextInput style={styles.birthdayInput} placeholder="YY" keyboardType="numeric" />
      </View>

      {/* Botón de registro */}
      <TouchableOpacity style={styles.signUpButton}>
        <Text style={styles.signUpText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Hipervínculo a Login */}
      <Text style={styles.loginText}>
        Already have an account?{" "}
        <Text style={styles.link} onPress={() => navigation.navigate("Login")}>
          Log in
        </Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFF1EC", alignItems: "center", justifyContent: "center", paddingHorizontal: 20 },
  logo: { width: 150, height: 150, resizeMode: "contain", marginBottom: 20 },
  input: { width: "100%", padding: 15, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, backgroundColor: "#fff", marginBottom: 10 },
  label: { alignSelf: "flex-start", marginLeft: 5, marginBottom: 5 },
  birthdayContainer: { flexDirection: "row", justifyContent: "space-between", width: "100%", marginBottom: 10 },
  birthdayInput: { width: "30%", padding: 10, borderWidth: 1, borderColor: "#ccc", borderRadius: 10, backgroundColor: "#fff", textAlign: "center" },
  signUpButton: { width: "100%", backgroundColor: "#1D4ED8", padding: 15, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  signUpText: { color: "#fff", fontWeight: "bold" },
  loginText: { marginTop: 10, fontSize: 14 },
  link: { color: "#1D4ED8", fontWeight: "bold" },
});

export default RegisterScreen;
