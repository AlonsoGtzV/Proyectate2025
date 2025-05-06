import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const problems = [
  "Seleccione un problema...",
  "Problema técnico",
  "Problema de acceso",
  "Problema de contenido",
  "Sugerencias",
  "Otros",
];

export default function Support({ navigation }) {
  const [problemSelected, setProblemSelected] = useState(problems[0]);
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // Cambiado a MediaTypeOptions.Images
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
        console.log("Imagen seleccionada:", result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error al seleccionar imagen:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Encabezado */}
      <View style={styles.header}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>Soporte</Text>
      </View>

      <ScrollView>
        {/* Texto de ayuda */}
        <Text style={styles.question}>¿Cómo podemos ayudarte?</Text>
        <Text style={styles.instructions}>
          Por favor, describe el problema con tantos detalles como puedas. Nos ayudará a entender mejor qué es lo que ocurre.
        </Text>

        {/* Campos del formulario */}
        <TextInput placeholder="Dirección de correo electrónico" style={styles.input} />
        <TextInput placeholder="Asunto" style={styles.input} />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={problemSelected}
            onValueChange={(itemValue) => {
              setProblemSelected(itemValue);
              console.log(`Área seleccionada: ${itemValue}`);
            }}
            style={styles.picker}
          >
            {problems.map((problem, index) => (
              <Picker.Item key={index} label={problem} value={problem} />
            ))}
          </Picker>
        </View>
        <TextInput
          placeholder="Descripción"
          style={[styles.input, { height: 100 }]}
          multiline
        />

        {/* Botón para agregar fotos */}
        <TouchableOpacity style={styles.fileButton} onPress={handlePickImage}>
          <Text style={styles.fileButtonText}>
            {selectedImage ? "Foto seleccionada" : "Agregar foto (opcional)"}
          </Text>
        </TouchableOpacity>

        {/* Mostrar la imagen seleccionada */}
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={styles.selectedImage}
          />
        )}

        {/* Botón para enviar */}
        <TouchableOpacity
          style={styles.sendButton}
          onPress={() =>
            Alert.alert(
              "Mensaje enviado",
              "Espera una respuesta pronto en tu bandeja de entrada.",
              [{ text: "Entendido", style: "default" }]
            )
          }
        >
          <Text style={styles.sendButtonText}>Enviar petición</Text>
        </TouchableOpacity>
      </ScrollView>

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
  question: {
    fontSize: 18,
    fontWeight: "900",
    marginBottom: 10,
    color: "#000",
    width: "90%",
    alignSelf: "center",
  },
  instructions: {
    fontSize: 14,
    marginBottom: 20,
    color: "#333",
    alignSelf: "center",
    width: "90%",
  },
  input: {
    backgroundColor: "#DDD9D7",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: "90%",
    alignSelf: "center",
  },
  sendButton: {
    backgroundColor: "#2C5E86",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    marginBottom: 40,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  pickerContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignSelf: "center",
    marginBottom: 12,
  },
  picker: {
    width: "100%",
    height: 50,
    backgroundColor: "#DDD9D7",
  },
  fileButton: {
    backgroundColor: "#DDD9D7",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  fileButtonText: {
    color: "#333",
    fontSize: 14,
    alignSelf: "left",
  },
  selectedImage: {
    width: "90%",
    height: 200,
    resizeMode: "contain",
    alignSelf: "center",
    marginBottom: 15,
  },
});