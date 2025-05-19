import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF1EC",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  header: {
    height: 180,
    marginTop: "-40%",
    alignItems: "center",
    marginBottom: "5%",
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: "contain",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  icon: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    color: "#007BFF",
    marginBottom: 20,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: "#2E5984",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  separatorText: {
    marginHorizontal: 10,
    color: "#333",
  },
  socialButtonGoogle: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  socialButtonApple: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    marginBottom: 20,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  socialButtonText: {
    fontSize: 16,
    color: "#000",
  },
  socialButtonappleText: {
    fontSize: 16,
    color: "#fff",
  },
  registerText: {
    fontSize: 14,
    color: "#333",
  },
  registeruser: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
    marginTop: 5,
  },

  // Estilos para RegisterScreen
  birthdayLabel: {
    alignSelf: "flex-start",
    marginBottom: 5,
    color: "#333",
    fontSize: 14,
  },
  birthdayInputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  birthdayInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    height: 40,
    textAlign: "center",
    marginHorizontal: 5,
    backgroundColor: "#fff",
  },
  signupButton: {
    backgroundColor: "#2E5984",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
  },
  signupButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  loginRedirectText: {
    fontSize: 14,
    color: "#333",
  },
  loginLink: {
    fontSize: 14,
    color: "#007BFF",
    fontWeight: "bold",
    marginTop: 5,
  },
});

