import React, { useState, useEffect } from "react";
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
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";
import TypingIndicator from "../styles/TypingIndicator";
import { useToken } from "../services/TokenContext";

export default function ChatBot({ navigation }) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const { darkMode, toggleTheme } = useTheme();
  const { translate } = useLanguage();
  const [userConfig, setUserConfig] = useState(null);
  const { token } = useToken();

  useEffect(() => {
    const fetchUserConfig = async () => {
      const userId = await AsyncStorage.getItem('userId');
      if (!userId || !token) return;
      try {
        const res = await fetch(`http://10.0.2.2:8080/api/users/${userId}`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (res.ok) {
          const user = await res.json();
          setUserConfig({
            language: user.languagePreference,
            englishLevel: user.englishLevel,
            area: user.specificArea,
          });
        }
      } catch (e) {
        // Manejo de error opcional
      }
    };
    fetchUserConfig();
  }, [token]);

  const handleSend = async () => {
    if (message.trim() === "") return;

    const lastAIMessage = messages
        .slice()
        .reverse()
        .find((msg) => msg.sender === "ai")?.text || "";
    console.log(userConfig?.language, lastAIMessage)
    // Construye el prompt con contexto
    const systemPrompt = `Eres un chatbot para una app de aprendizaje de inglés técnico.
Idioma preferido del usuario: ${userConfig?.language || "español"}.
Nivel de inglés: ${userConfig?.englishLevel || "desconocido"}.
Área de interés: ${userConfig?.area || "general"}.
Si el usuario pregunta algo fuera de ese contexto, responde: 'Lo siento, solo puedo responder preguntas sobre inglés técnico.'`;
    const fullPrompt = `${systemPrompt}\nUsuario: ${message}\nIA anterior: ${lastAIMessage}`;

    // Muestra el mensaje del usuario
    setMessages([...messages, { text: message, sender: "user" }]);
    setMessage("");
    setIsTyping(true);

    try {
      const response = await fetch("http://10.0.2.2:8080/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: fullPrompt }),
      });
      const data = await response.json();

      // data debería ser { response: "texto de la IA" }
      setMessages((prev) => [...prev, { text: data.response, sender: "ai" }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { text: "Error de conexión con la IA.", sender: "ai" },
      ]);
    }
    finally {
        setIsTyping(false);
    }
  };

  // Estilos dinámicos basados en el tema
  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? '#121212' : '#EFF0EB',
    },
    header: {
      backgroundColor: darkMode ? '#1E1E1E' : '#2C5E86',
    },
    headerText: {
      color: darkMode ? '#E0E0E0' : 'white',
    },
    logo: {
      backgroundColor: darkMode ? '#EFF1EC' : '#EFF1EC',
    },
    chatContainer: {
      backgroundColor: darkMode ? '#121212' : '#EFF0EB',
    },
    userMessage: {
      backgroundColor: darkMode ? '#2C5E86' : '#83D8E1',
    },
    messageText: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    aiMessageContainer: {
      backgroundColor: darkMode ? '#1E1E1E' : '#F0F8FF',
      borderLeftColor: darkMode ? '#BDE4E6' : '#2C5E86',
    },
    aiMessageText: {
      color: darkMode ? '#E0E0E0' : '#333',
    },
    inputContainer: {
      backgroundColor: darkMode ? '#1E1E1E' : '#EFF1EC',
      borderColor: darkMode ? '#333' : '#ccc',
    },
    textInput: {
      backgroundColor: darkMode ? '#333' : '#fff',
      color: darkMode ? '#E0E0E0' : '#000',
    },
    footer: {
      backgroundColor: darkMode ? '#1E1E1E' : '#BDE4E6',
    },
    footerIcon: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    footerLogoButton: {
      backgroundColor: darkMode ? '#333' : '#EFF1EC',
      borderColor: darkMode ? '#555' : '#BDE4E6',
    },
    footerLogo: {
      borderColor: darkMode ? '#555' : '#BDE4E6',
      backgroundColor: darkMode ? '#EFF1EC' : '#EFF1EC',
    },
    infoText: {
      color: darkMode ? '#999' : '#666',
    }
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Header */}
      <View style={[styles.header, dynamicStyles.header]}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={[styles.logo, dynamicStyles.logo]}
        />
        <Text style={[styles.headerText, dynamicStyles.headerText]}>Chatbot</Text>
      </View>

      {/* Chat Area */}
      <ScrollView style={[styles.chatContainer, dynamicStyles.chatContainer]}>
        {/* Mensaje de bienvenida de la IA */}
        <View style={[styles.aiMessageContainer, dynamicStyles.aiMessageContainer]}>
          <Text style={[styles.aiMessageText, dynamicStyles.aiMessageText]}>
            {translate("chat.message")}
          </Text>
        </View>

        {messages.map((msg, index) => (
          <View
            key={index}
            style={
              msg.sender === "user"
                ? [styles.messageBubble, styles.userMessage, dynamicStyles.userMessage]
                : [styles.aiMessageContainer, dynamicStyles.aiMessageContainer]
            }
          >
            <Text style={
              msg.sender === "user"
                ? [styles.messageText, dynamicStyles.messageText]
                : [styles.aiMessageText, dynamicStyles.aiMessageText]
            }>
              {msg.text}
            </Text>
          </View>
        ))}

        {/* Indicador de que la IA está escribiendo */}
        {isTyping && (
            <View style={[styles.aiMessageContainer, dynamicStyles.aiMessageContainer]}>
              <TypingIndicator color={darkMode ? "#BDE4E6" : "#2C5E86"} />
            </View>
        )}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputContainer, dynamicStyles.inputContainer]}>
        <TextInput
          style={[styles.textInput, dynamicStyles.textInput]}
          value={message}
          onChangeText={setMessage}
          placeholder={translate("chat.type")}
          placeholderTextColor={darkMode ? "#999" : "#666"}
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Contenedor para los textos e información */}
      <View style={styles.infoContainer}>
        <Text style={[styles.infoText, dynamicStyles.infoText]}>{translate("chat.info1")}</Text>
        <Text style={[styles.infoText, dynamicStyles.infoText]}>{translate("chat.info2")}</Text>
      </View>

      {/* Footer */}
      <View style={[styles.footer, dynamicStyles.footer]}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Syllabus")}
          style={styles.footerIcon1}
        >
          <Ionicons 
            name="calendar" 
            size={24} 
            color={dynamicStyles.footerIcon.color} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Progress")}
          style={styles.footerIcon2}
        >
          <Ionicons 
            name="stats-chart" 
            size={24} 
            color={dynamicStyles.footerIcon.color} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("Home")}
          style={[styles.footerLogoButton, dynamicStyles.footerLogoButton]}
        >
          <Image
            source={require("../assets/Synlogo.png")}
            style={[styles.footerLogo, dynamicStyles.footerLogo]}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("ChatBot")}
          style={styles.footerIcon3}
        >
          <Ionicons 
            name="chatbubble-ellipses" 
            size={24} 
            color={dynamicStyles.footerIcon.color} 
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("User")}
          style={styles.footerIcon4}
        >
          <Ionicons 
            name="person-circle" 
            size={26} 
            color={dynamicStyles.footerIcon.color} 
          />
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
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerIcon2: {
    position: "absolute",
    left: 100,
    bottom: 10,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerIcon3: {
    position: "absolute",
    right: 100,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerIcon4: {
    position: "absolute",
    right: 20,
    bottom: 10,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
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
    alignSelf: "flex-start",
    maxWidth: "85%",
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