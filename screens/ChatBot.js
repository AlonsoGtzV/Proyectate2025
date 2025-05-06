import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ChatBot({ navigation }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (message.trim() === "") return;

    const newMessage = { text: message, sender: "user" };
    setMessages([...messages, newMessage]);
    setMessage("");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Chatbot</Text>
      </View>

      {/* Chat Area */}
      <ScrollView style={styles.chatContainer}>
        {/* Mensaje de bienvenida de la IA */}
        <View style={styles.aiMessageContainer}>
          <Text style={styles.aiMessageText}>
            ¡Hola! Soy Syn. Estoy aquí para ayudarte a aprender inglés técnico. 😊
          </Text>
        </View>

        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.sender === "user"
                ? styles.userMessage
                : styles.aiMessage,
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Escribe tu mensaje..."
          placeholderTextColor="#999"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Contenedor para los textos e información */}
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Syn puede cometer errores.</Text>
        <Text style={styles.infoText}>Sé amable al chatear</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Ionicons name="calendar" size={24} color="#000" style={styles.footerIcon1} />
        <Ionicons name="stats-chart" size={24} color="#000" style={styles.footerIcon2} />
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={styles.footerLogoButton}
        >
          <Image
            source={require("../assets/Synlogo.png")}
            style={styles.footerLogo}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChatBot")}
          style={styles.footerIcon3}
        >
          <Ionicons name="chatbubble-ellipses" size={24} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("User")}
          style={styles.footerIcon4}
        >
          <Ionicons name="person-circle" size={26} color="#000" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#EFF0EB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2C5E86",
    padding: 15,
    paddingTop: 50,
    justifyContent: "center",
    gap: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 25,
    backgroundColor: "#EFF1EC",
  },
  headerText: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
  chatContainer: {
    flex: 1,
    padding: 10,
    marginBottom: 20,
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    maxWidth: "80%",
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#83D8E1",
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#CDE8F0",
  },
  messageText: {
    fontSize: 14,
    color: "#000",
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    backgroundColor: "#EFF1EC",
  },
  textInput: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
    color: "#000",
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#2C5E86",
    padding: 10,
    borderRadius: 20,
  },
  footer: {
    height: 50,
    backgroundColor: "#BDE4E6",
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  footerIcon1: {
    position: "absolute",
    left: 20,
    bottom: 10,
  },
  footerIcon2: {
    position: "absolute",
    left: 100,
    bottom: 10,
  },
  footerIcon3: {
    position: "absolute",
    right: 100,
    bottom: 10,
  },
  footerIcon4: {
    position: "absolute",
    right: 20,
    bottom: 10,
  },
  footerLogo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#BDE4E6",
  },
  footerLogoButton: {
    position: "absolute",
    top: -40,
    left: "50%",
    transform: [{ translateX: -40 }],
    backgroundColor: "#EFF1EC",
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#BDE4E6",
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  aiMessageContainer: {
    backgroundColor: "#F0F8FF",
    padding: 15,
    marginVertical: 10,
    borderRadius: 15,
    borderLeftWidth: 5,
    borderLeftColor: "#2C5E86",
  },
  aiMessageText: {
    color: "#333",
    fontSize: 14,
    fontStyle: "italic",
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  infoText: {
    fontSize: 10.5,
    color: "#666",
    fontStyle: "italic",
  },
});
