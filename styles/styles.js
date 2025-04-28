import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
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
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 10,
    marginVertical: 8,
    width: "100%",
  },
  icon: {
    marginRight: 10,
  },
  iconRight: {
    marginLeft: "auto",
  },
  input: {
    flex: 1,
    paddingVertical: 12,
  },
  forgotPassword: {
    color: "#007BFF",
    marginTop: 5,
    fontSize: 14,
    marginLeft: "50%",
  },
  loginButton: {
    backgroundColor: "#1E3A8A",
    paddingVertical: 12,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#ccc",
  },
  separatorText: {
    marginHorizontal: 10,
    fontSize: 16,
    color: "#666",
  },
  socialButtonGoogle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
  },
  socialButtonApple: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 8,
    width: "100%",
    marginBottom: 10,
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginLeft: 10,
  },
  socialButtonText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#000",
  },
  socialButtonappleText: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
  },
  registerText: {
    marginTop: 15,
    fontSize: 14,
    color: "#333",
  },
  registeruser: {
    color: "#007BFF",
    marginTop: 5,
    fontSize: 14,
  },
});

export default styles;