import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  TextInput,
  Switch,
  Modal,
  ActivityIndicator
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from "@expo/vector-icons";
import { useTutorial } from "./TutorialContext";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "./LanguageContext";
import { useUser } from "./UserContext";
import {getUser, updateUserPartial} from "../services/api";
import {useToken} from "../services/TokenContext";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserScreen({ navigation }) {
  const { resetTutorial } = useTutorial();
  const { darkMode, toggleTheme } = useTheme();
  const { language, setLanguage, translate, isLoading } = useLanguage();
  const { token } = useToken();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [englishLevel, setEnglishLevel] = useState('');
  const [specificArea, setSpecificArea] = useState('');
  const [languagePreference, setLanguagePreference] = useState('');
  const [loading, setLoading] = useState(true);
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [isAreaModalVisible, setAreaModalVisible] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const userData = await getUser(token);
        setUser(userData);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const mapEnglishLevel = (level) => {
    if (level === "A1" || level === "A2") return "Beginner";
    if (level === "B1" || level === "B2") return "Intermediate";
    if (level === "C1" || level === "C2") return "Advanced";
    return null;
  };

  const mapLanguage = (lang) => {
    if (lang === "es") return "es";
    if (lang === "en" || lang === "us") return "us";
    return null;
  };

  const mapArea = (area) => {
    if (area === "Software") return "Software";
    if (area === "Electronica") return "Electronics";
    return null;
  };

  const handleSave = async () => {
    if (!user) return;
    const data = {
      email: email !== '' ? email : null,
      englishLevel: englishLevel !== '' ? englishLevel : null,
      languagePreference: languagePreference !== '' ? languagePreference : null,
      specificArea: specificArea !== '' ? specificArea : null,
    };
    setLoading(true);
    try {
      await updateUserPartial(token, data);
      // Refresca los datos del usuario
      const updatedUser = await getUserById(token);
      setUser(updatedUser);
      setEmail('');
      setEnglishLevel('');
      setLanguagePreference('');
      setSpecificArea('');
      alert(translate('changes_saved') || 'Cambios guardados');
    } catch (e) {
      alert(translate('error_saving') || 'Error al guardar');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !user) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: darkMode ? '#121212' : '#EFF1EB' }}>
          <ActivityIndicator size="large" color={darkMode ? '#BDE4E6' : '#2C5E86'} />
        </View>
    );
  }

  const handleTutorialPress = async () => {
    await resetTutorial();
    navigation.navigate("Home");
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setLanguageModalVisible(false);
  };



  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? '#121212' : '#EFF1EB',
    },
    header: {
      backgroundColor: darkMode ? '#1E1E1E' : '#2C5E86',
    },
    headerText: {
      color: darkMode ? '#E0E0E0' : 'white',
    },
    footer: {
      backgroundColor: darkMode ? '#1E1E1E' : '#BDE4E6',
    },
    input: {
      backgroundColor: darkMode ? '#333' : '#fff',
      color: darkMode ? '#fff' : '#333',
      borderColor: darkMode ? '#555' : '#ccc',
    },
    label: {
      color: darkMode ? '#E0E0E0' : '#333',
    },
    sectionTitle: {
      color: darkMode ? '#E0E0E0' : '#333',
    },
    button: {
      backgroundColor: darkMode ? '#2C5E86' : '#2C5E86',
    },
    buttonText: {
      color: darkMode ? '#E0E0E0' : '#fff',
    },
    footerIcon: {
      color: darkMode ? '#E0E0E0' : '#000',
    },
    footerLogoButton: {
      backgroundColor: darkMode ? '#EFF1EC' : '#EFF1EC',
      borderColor: darkMode ? '#555' : '#BDE4E6',
    },
    scrollContent: {
      backgroundColor: darkMode ? '#121212' : '#EFF0EB',
    },
    placeholderText: {
      color: darkMode ? '#999' : '#ccc',
    },
    footerLogo: {
      borderColor: darkMode ? '#555' : '#BDE4E6',
    },
  });

  const modalStyles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
      backgroundColor: darkMode ? '#333' : '#fff',
      padding: 20,
      borderRadius: 10,
      width: "80%",
      alignItems: "center",
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 20,
      color: darkMode ? '#E0E0E0' : '#333',
    },
    modalOption: {
      fontSize: 16,
      marginVertical: 10,
      color: darkMode ? '#E0E0E0' : '#333',
    },
    modalCancel: {
      marginTop: 20,
      color: darkMode ? '#ff6b6b' : 'red',
    },
    infoText: {
      fontSize: 16,
      padding: 10,
      color: darkMode ? '#E0E0E0' : '#333',
    }
  });

  if (isLoading) {
    return (
      <View style={[styles.container, dynamicStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={darkMode ? '#BDE4E6' : '#2C5E86'} />
      </View>
    );
  }

  return (
      <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#EFF1EB' }]}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: darkMode ? '#1E1E1E' : '#2C5E86' }]}>
          <Image
              source={require("../assets/Synlogo.png")}
              style={[styles.logo, { backgroundColor: '#EFF1EC' }]}
          />
          <Text style={[styles.headerText, { color: darkMode ? '#E0E0E0' : 'white' }]}>{translate('profile')}</Text>
        </View>

        {/* Contenido principal */}
        <ScrollView
            style={styles.lessonContainer}
            contentContainerStyle={[styles.scrollContent, { backgroundColor: darkMode ? '#121212' : '#EFF0EB' }]}
        >
          <Text style={[styles.sectionTitle, { color: darkMode ? '#E0E0E0' : '#333' }]}>
            {translate('personalInfo')}
          </Text>
          <Text style={[styles.infoText, { color: darkMode ? '#E0E0E0' : '#333', marginBottom: 10 }]}>
            {user.cognitoUsername}
          </Text>

          <TextInput
              placeholder={translate('email')}
              placeholderTextColor={darkMode ? '#999' : '#ccc'}
              style={[styles.input, { backgroundColor: darkMode ? '#333' : '#fff', color: darkMode ? '#fff' : '#333' }]}
              value={email !== '' ? email : user.email}
              onChangeText={setEmail}
          />

          <Text style={[styles.label, { color: darkMode ? '#E0E0E0' : '#333', marginBottom: 5 }]}>
            {'Select English Level'}
          </Text>
          <View style={{ borderWidth: 1, borderRadius: 6, marginBottom: 10, backgroundColor: darkMode ? '#333' : '#fff' }}>
            <Picker
                selectedValue={englishLevel}
                onValueChange={setEnglishLevel}
                style={{ color: englishLevel ? (darkMode ? '#fff' : '#333') : (darkMode ? '#999' : '#ccc') }}
                dropdownIconColor={darkMode ? '#BDE4E6' : '#666'}
            >
              <Picker.Item label={user.englishLevel} value="" enabled={false} />
              <Picker.Item label="A1" value="A1" />
              <Picker.Item label="A2" value="A2" />
              <Picker.Item label="B1" value="B1" />
              <Picker.Item label="B2" value="B2" />
              <Picker.Item label="C1" value="C1" />
              <Picker.Item label="C2" value="C2" />
            </Picker>
          </View>

          <Text style={[styles.sectionTitle, { color: darkMode ? '#E0E0E0' : '#333' }]}>
            {translate('settings')}
          </Text>

          <Text style={[styles.label, { color: darkMode ? '#E0E0E0' : '#333', marginBottom: 5 }]}>
            {translate('interfaceLanguage')}
          </Text>
          <TouchableOpacity
              style={{ borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 10, backgroundColor: darkMode ? '#333' : '#fff' }}
              onPress={() => setLanguageModalVisible(true)}
          >
            <Text style={{ color: darkMode ? '#fff' : '#333' }}>
              {user.languagePreference === "es" ? translate('spanish') : translate('english')}
            </Text>
          </TouchableOpacity>


          <TouchableOpacity
              style={{ borderWidth: 1, borderRadius: 6, padding: 10, marginBottom: 10, backgroundColor: darkMode ? '#333' : '#fff' }}
              onPress={() => setAreaModalVisible(true)}
          >
            <Text style={{ color: darkMode ? '#fff' : '#333' }}>
              {user.specificArea === "Electronics" ? "Electronics" : "Software"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
              style={{ padding: 12, borderRadius: 6, marginBottom: 10, alignItems: "center", backgroundColor: darkMode ? '#2C5E86' : '#2C5E86' }}
              onPress={handleSave}
          >
            <Text style={{ fontWeight: "bold", color: darkMode ? '#E0E0E0' : '#fff' }}>
              {translate('save_changes') || 'Guardar Cambios'}
            </Text>
          </TouchableOpacity>

          {/* Ajustes de visualización */}
          <Text style={{ fontWeight: "bold", fontSize: 16, marginTop: 20, marginBottom: 10, color: darkMode ? '#E0E0E0' : '#333' }}>
            {translate('displaySettings')}
          </Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: darkMode ? '#E0E0E0' : '#333' }}>
              {translate('darkMode')}
            </Text>
            <Switch
                value={darkMode}
                onValueChange={toggleTheme}
                thumbColor={darkMode ? '#2C5E86' : '#f4f3f4'}
                trackColor={{ false: '#767577', true: '#BDE4E6' }}
            />
          </View>

          {/* Soporte y tutorial */}
          <Text style={[styles.sectionTitle, { color: darkMode ? '#E0E0E0' : '#333' }]}>
            {translate('helpSupport')}
          </Text>
          <TouchableOpacity
              style={[styles.button, { backgroundColor: darkMode ? '#2C5E86' : '#2C5E86' }]}
              onPress={handleTutorialPress}
          >
            <Text style={[styles.buttonText, { color: darkMode ? '#E0E0E0' : '#fff' }]}>
              {translate('tutorial')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
              style={[styles.button, { backgroundColor: darkMode ? '#2C5E86' : '#2C5E86' }]}
              onPress={() => navigation.navigate("Support")}
          >
            <Text style={[styles.buttonText, { color: darkMode ? '#E0E0E0' : '#fff' }]}>
              {translate('support')}
            </Text>
          </TouchableOpacity>
        </ScrollView>

      <Modal
          animationType="slide"
          transparent={true}
          visible={isLanguageModalVisible}
          onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: darkMode ? '#333' : '#fff', padding: 20, borderRadius: 10, width: "80%", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20, color: darkMode ? '#E0E0E0' : '#333' }}>{translate('selectLanguage')}</Text>
            <TouchableOpacity onPress={() => { setLanguagePreference("es"); setLanguageModalVisible(false); }}>
              <Text style={{ fontSize: 16, marginVertical: 10, color: darkMode ? '#E0E0E0' : '#333' }}>{translate('spanish')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setLanguagePreference("us"); setLanguageModalVisible(false); }}>
              <Text style={{ fontSize: 16, marginVertical: 10, color: darkMode ? '#E0E0E0' : '#333' }}>{translate('english')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
              <Text style={{ marginTop: 20, color: darkMode ? '#ff6b6b' : 'red' }}>{translate('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
          animationType="slide"
          transparent={true}
          visible={isAreaModalVisible}
          onRequestClose={() => setAreaModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <View style={{ backgroundColor: darkMode ? '#333' : '#fff', padding: 20, borderRadius: 10, width: "80%", alignItems: "center" }}>
            <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20, color: darkMode ? '#E0E0E0' : '#333' }}>Selecciona área</Text>
            <TouchableOpacity onPress={() => { setSpecificArea("Software"); setAreaModalVisible(false); }}>
              <Text style={{ fontSize: 16, marginVertical: 10, color: darkMode ? '#E0E0E0' : '#333' }}>Software</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { setSpecificArea("Electronics"); setAreaModalVisible(false); }}>
              <Text style={{ fontSize: 16, marginVertical: 10, color: darkMode ? '#E0E0E0' : '#333' }}>Electronics</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setAreaModalVisible(false)}>
              <Text style={{ marginTop: 20, color: darkMode ? '#ff6b6b' : 'red' }}>{translate('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

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
  },
  infoText: {
    fontSize: 16,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    paddingTop: 50,
    justifyContent: "center",
    gap: 10,
    width: "100%",
    marginBottom: 10,
  },
  logo: {
    width: 50,
    height: 50,
    marginRight: 10,
    resizeMode: "contain",
    borderRadius: 25,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
  },
  footer: {
    height: 50,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  footerLogo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
    borderRadius: 40,
    borderWidth: 2,
  },
  footerLogoButton: {
    position: "absolute",
    top: -40,
    left: "50%",
    transform: [{ translateX: -40 }],
    borderRadius: 40,
    borderWidth: 2,
    width: 80,
    height: 80,
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
  lessonContainer: {
    flex: 1,
    paddingHorizontal: 20,
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  sectionTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
  },
  button: {
    padding: 12,
    borderRadius: 6,
    marginBottom: 10,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 10,
    justifyContent: 'center',
  },
});