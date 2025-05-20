import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
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
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";

export default function Support({ navigation }) {
  const { darkMode } = useTheme();
  const { translate } = useLanguage();
  const problems = translate("supportProblems") || [];
  const [problemSelected, setProblemSelected] = useState(problems[0] || "");
  const [selectedImage, setSelectedImage] = useState(null);

  const handlePickImage = async () => {
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        translate("supportPermissionDeniedTitle"),
        translate("supportPermissionDeniedMessage")
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
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
    question: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    instructions: {
      color: darkMode ? '#BDE4E6' : '#333',
    },
    input: {
      backgroundColor: darkMode ? '#333' : '#DDD9D7',
      color: darkMode ? '#E0E0E0' : '#000',
    },
    pickerContainer: {
      backgroundColor: darkMode ? '#333' : '#fff',
      borderColor: darkMode ? '#555' : '#ccc',
    },
    picker: {
      backgroundColor: darkMode ? '#333' : '#DDD9D7',
      color: darkMode ? '#E0E0E0' : '#000',
    },
    fileButton: {
      backgroundColor: darkMode ? '#333' : '#DDD9D7',
    },
    fileButtonText: {
      color: darkMode ? '#E0E0E0' : '#333',
    },
    sendButton: {
      backgroundColor: darkMode ? '#2C5E86' : '#2C5E86',
    },
    footer: {
      backgroundColor: darkMode ? '#1E1E1E' : '#BDE4E6',
    },
    footerIcon: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    footerLogoButton: {
      backgroundColor: darkMode ? '#EFF1EC' : '#EFF1EC',
      borderColor: darkMode ? '#555' : '#BDE4E6',
    },
    footerLogo: {
      backgroundColor: darkMode ? '#EFF1EC' : '#EFF1EC',
      borderColor: darkMode ? '#555' : '#BDE4E6',
    },
    placeholderColor: {
      color: darkMode ? '#999' : '#aaa',
    }
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      {/* Encabezado */}
      <View style={[styles.header, dynamicStyles.header]}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={[styles.logo, dynamicStyles.logo]}
        />
        <Text style={[styles.headerText, dynamicStyles.headerText]}>{translate("supportTitle")}</Text>

      </View>

      <ScrollView>
        {/* Texto de ayuda */}
        <Text style={[styles.question, dynamicStyles.question]}>{translate("supportQuestion")}</Text>
<Text style={[styles.instructions, dynamicStyles.instructions]}>
  {translate("supportInstructions")}
</Text>


        {/* Campos del formulario */}
        <TextInput 
          placeholder={translate("supportEmailPlaceholder")} 
          style={[styles.input, dynamicStyles.input]} 
          placeholderTextColor={dynamicStyles.placeholderColor.color}
        />
        <TextInput 
          placeholder={translate("supportSubjectPlaceholder")} 
          style={[styles.input, dynamicStyles.input]} 
          placeholderTextColor={dynamicStyles.placeholderColor.color}
        />
        <View style={[styles.pickerContainer, dynamicStyles.pickerContainer]}>
          <Picker
            selectedValue={problemSelected}
            onValueChange={(itemValue) => {
              setProblemSelected(itemValue);
              console.log(`Área seleccionada: ${itemValue}`);
            }}
            style={[styles.picker, dynamicStyles.picker]}
            dropdownIconColor={darkMode ? '#BDE4E6' : '#666'}
          >
            {problems.map((problem, index) => (
              <Picker.Item 
                key={index} 
                label={problem} 
                value={problem} 
                color={darkMode ? (problem === problems[0] ? '#999' : '#E0E0E0') : '#000'}
              />
            ))}
          </Picker>
        </View>
        <TextInput
           placeholder={translate("supportDescriptionPlaceholder")}
          style={[styles.input, dynamicStyles.input, { height: 100 }]}
          multiline
          placeholderTextColor={dynamicStyles.placeholderColor.color}
        />

        {/* Botón para agregar fotos */}
        <TouchableOpacity 
          style={[styles.fileButton, dynamicStyles.fileButton]} 
          onPress={handlePickImage}
        >
          <Text style={[styles.fileButtonText, dynamicStyles.fileButtonText]}>
  {selectedImage ? translate("supportPhotoSelected") : translate("supportAddPhoto")}
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
          style={[styles.sendButton, dynamicStyles.sendButton]}
          onPress={() =>
            Alert.alert(
              translate("supportSentTitle"),
              translate("supportSentMessage"),
              [{ text: translate("understood"), style: "default" }]
            )
          }
        >
          <Text style={styles.sendButtonText}>{translate("supportSend")}</Text>
        </TouchableOpacity>
      </ScrollView>

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
      <StatusBar style={darkMode ? "light" : "dark"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF0EB",
  },
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