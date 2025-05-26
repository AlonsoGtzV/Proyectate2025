import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import {
  View,
  Alert,
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
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);
  const [specificArea, setSpecificArea] = useState('');
  const [languagePreference, setLanguagePreference] = useState('');
  const [loading, setLoading] = useState(true);

  const [isAreaModalVisible, setAreaModalVisible] = useState(false);

  useEffect(() => {
    const saveLanguagePreference = async () => {
      try {
        await AsyncStorage.setItem('@app_language', language);
      } catch (error) {
        console.error('Error guardando preferencia de idioma:', error);
        Alert.alert(
          translate('user.settings.error'),
          translate('user.settings.language_save_error')
        );
      }
    };
    if (language) saveLanguagePreference();
  }, [language]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) return;
      setLoading(true);
      try {
        const userData = await getUser(token);
        if (!userData) throw new Error('No se encontraron datos de usuario');

        setUser(userData);
        setEnglishLevel(userData.englishLevel || '');
        setSpecificArea(userData.specificArea || '');
        setLanguagePreference(userData.languagePreference || language);

      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
        setUser(null);
        Alert.alert(
          translate('common.error'),
          translate('user.fetch_error')
        );
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [token]);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const data = {
        email: email.trim() || null,
        englishLevel: englishLevel || null,
        languagePreference: languagePreference || null,
        specificArea: specificArea || null
      };

      // Primero actualizar el usuario en el backend
      await updateUserPartial(token, data);

      // Luego guardar el idioma en AsyncStorage y actualizar el contexto
      if (languagePreference) {
        await AsyncStorage.setItem('@app_language', languagePreference);
        setLanguage(languagePreference);
      }

      // Después obtener los datos actualizados
      const updatedUser = await getUser(token);
      setUser(updatedUser);

      // Limpiar campos
      setEmail('');
      setEnglishLevel('');
      setLanguagePreference('');
      setSpecificArea('');

    } catch (error) {
      console.error('Error al guardar:', error);
      Alert.alert(
          translate('common.error')
      );
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
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={[styles.header, dynamicStyles.header]}>
        <Image
          source={require("../assets/Synlogo.png")}
          style={[styles.logo, { backgroundColor: '#EFF1EC' }]}
        />
        <Text style={[styles.headerText, dynamicStyles.headerText]}>{translate('user.profile')}</Text>
      </View>

      <ScrollView
        style={styles.lessonContainer}
        contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollContent]}
      >
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {translate('user.personalInfo')}
        </Text>
        <Text style={[styles.infoText, dynamicStyles.infoText]}>
          {user.cognitoUsername}
        </Text>

        <TextInput 
          placeholder={user.email}
          placeholderTextColor={dynamicStyles.placeholderText.color}
          style={[styles.input, dynamicStyles.input]}
          onChangeText={setEmail}
        />

        <Text style={[styles.label, dynamicStyles.label, { marginBottom: 5 }]}>
          {'Select your English level'}
        </Text>

<View style={[styles.pickerContainer, dynamicStyles.input]}>
  <Picker
    selectedValue={englishLevel}
    onValueChange={setEnglishLevel}
    style={{ color: englishLevel ? dynamicStyles.input.color : dynamicStyles.placeholderText.color }}
    dropdownIconColor={darkMode ? '#BDE4E6' : '#666'}
  >
    <Picker.Item label={englishLevel || translate('user.selectLevel')} value="" enabled={false} />
    <Picker.Item label={translate('user.a1')} value="Beginner" />
    <Picker.Item label={translate('user.a2')} value="Beginner" />
    <Picker.Item label={translate('user.b1')} value="Intermediate" />
    <Picker.Item label={translate('user.b2')} value="Intermediate" />
    <Picker.Item label={translate('user.c1')} value="Advanced" />
    <Picker.Item label={translate('user.c2')} value="Advanced" />
  </Picker>
</View>

        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {translate('user.settings')}
        </Text>

        <Text style={[styles.label, dynamicStyles.label, { marginBottom: 5 }]}>
          {translate('user.interfaceLanguage')}
        </Text>
        <TouchableOpacity
          style={[styles.input, dynamicStyles.input, { justifyContent: "center" }]}
          onPress={async () => {
            setLanguagePreference(languagePreference);
            setLanguageModalVisible(true);
          }}
        >
          <Text style={{ color: dynamicStyles.input.color }}>
            {languagePreference || translate('user.selectLanguage')}
          </Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={[styles.input, dynamicStyles.input, { justifyContent: "center" }]}
          onPress={() => setAreaModalVisible(true)}
        >
          <Text style={{ color: dynamicStyles.input.color }}>
            {specificArea || translate('selectArea')}
          </Text>
        </TouchableOpacity>



        <TouchableOpacity
            style={[styles.button, dynamicStyles.button]}
            onPress={handleSave}
        >
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
            {translate('user.save')}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {translate('user.displaySettings')}
        </Text>
        <View style={styles.row}>
          <Text style={[styles.label, dynamicStyles.label]}>
            {translate('user.darkMode')}
          </Text>
          <Switch 
            value={darkMode} 
            onValueChange={toggleTheme}
            thumbColor={darkMode ? '#2C5E86' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#BDE4E6' }}
          />
        </View>

        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {translate('user.helpSupport')}
        </Text>
        <TouchableOpacity 
          style={[styles.button, dynamicStyles.button]} 
          onPress={handleTutorialPress}
        >
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
            {translate('user.tutorial')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, dynamicStyles.button]}
          onPress={() => navigation.navigate("Support")}
        >
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
            {translate('user.support')}
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isLanguageModalVisible}
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" }}>
            <View style={{ backgroundColor: darkMode ? '#333' : '#fff', padding: 20, borderRadius: 10, width: "80%", alignItems: "center" }}>
              <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20, color: darkMode ? '#E0E0E0' : '#333' }}>{translate('user.selectLanguage')}</Text>
              <TouchableOpacity onPress={() => { setLanguagePreference("es"); setLanguageModalVisible(false); }}>
                <Text style={{ fontSize: 16, marginVertical: 10, color: darkMode ? '#E0E0E0' : '#333' }}>{translate('user.spanish')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { setLanguagePreference("us"); setLanguageModalVisible(false); }}>
                <Text style={{ fontSize: 16, marginVertical: 10, color: darkMode ? '#E0E0E0' : '#333' }}>{translate('user.english')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Text style={{ marginTop: 20, color: darkMode ? '#ff6b6b' : 'red' }}>{translate('common.cancel')}</Text>
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
                <Text style={{ marginTop: 20, color: darkMode ? '#ff6b6b' : 'red' }}>{translate('common.cancel')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>

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