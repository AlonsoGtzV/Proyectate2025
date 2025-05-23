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
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function UserScreen({ navigation }) {
  const { resetTutorial } = useTutorial();
  const { darkMode, toggleTheme } = useTheme();
  const { language, setLanguage, translate, isLoading } = useLanguage();

  const [localUser, setLocalUser] = useState({ username: '', email: '', englishLevel: '', specificArea: '' });

  const { userInfo } = useUser();
  const [englishLevel, setEnglishLevel] = useState('');
  const [isLanguageModalVisible, setLanguageModalVisible] = useState(false);

  const handleTutorialPress = async () => {
    await resetTutorial();
    navigation.navigate("Home");
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    setLanguageModalVisible(false);
  };

  useEffect(() => {
    const loadUserData = async () => {
    try {
      const stored = await AsyncStorage.getItem('userData');
      if (stored) {
        const parsed = JSON.parse(stored);
        setLocalUser(parsed);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  loadUserData();
  }, []);

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
        <Text style={[styles.headerText, dynamicStyles.headerText]}>{translate('profile')}</Text>
      </View>

      <ScrollView
        style={styles.lessonContainer}
        contentContainerStyle={[styles.scrollContent, dynamicStyles.scrollContent]}
      >
        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {translate('personalInfo')}
        </Text>
        <TextInput 
          placeholder={localUser.username}
          placeholderTextColor={dynamicStyles.placeholderText.color}
          style={[styles.input, dynamicStyles.input]} 
          editable={false}
        />
        <TextInput 
          placeholder={localUser.email}
          placeholderTextColor={dynamicStyles.placeholderText.color}
          style={[styles.input, dynamicStyles.input]} 
          editable={false}
        />

        <Text style={[styles.label, dynamicStyles.label, { marginBottom: 5 }]}>
          {localUser.englishLevel}
        </Text>
        <View style={[styles.pickerContainer, dynamicStyles.input]}>
          <Picker
            selectedValue={englishLevel}
            onValueChange={(value) => setEnglishLevel(value)}
            style={{ color: englishLevel ? dynamicStyles.input.color : dynamicStyles.placeholderText.color }}
            dropdownIconColor={darkMode ? '#BDE4E6' : '#666'}
          >
            <Picker.Item 
              label={translate('selectLevel')} 
              value="" 
              enabled={false} 
            />
            <Picker.Item label={translate('a1')} value="A1" />
            <Picker.Item label={translate('a2')} value="A2" />
            <Picker.Item label={translate('b1')} value="B1" />
            <Picker.Item label={translate('b2')} value="B2" />
            <Picker.Item label={translate('c1')} value="C1" />
            <Picker.Item label={translate('c2')} value="C2" />
          </Picker>
        </View>

        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {translate('settings')}
        </Text>

        <Text style={[styles.label, dynamicStyles.label, { marginBottom: 5 }]}>
          {translate('interfaceLanguage')}
        </Text>
        <TouchableOpacity
          style={[styles.input, dynamicStyles.input, { justifyContent: "center" }]}
          onPress={() => setLanguageModalVisible(true)}
        >
          <Text style={{ color: dynamicStyles.input.color }}>
            {language === "es" ? translate('spanish') : translate('english')}
          </Text>
        </TouchableOpacity>

        <TextInput 
          placeholder={localUser.specificArea}
          placeholderTextColor={dynamicStyles.placeholderText.color}
          style={[styles.input, dynamicStyles.input]} 
          editable={false}
        />

        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {translate('displaySettings')}
        </Text>
        <View style={styles.row}>
          <Text style={[styles.label, dynamicStyles.label]}>
            {translate('darkMode')}
          </Text>
          <Switch 
            value={darkMode} 
            onValueChange={toggleTheme}
            thumbColor={darkMode ? '#2C5E86' : '#f4f3f4'}
            trackColor={{ false: '#767577', true: '#BDE4E6' }}
          />
        </View>

        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
          {translate('helpSupport')}
        </Text>
        <TouchableOpacity 
          style={[styles.button, dynamicStyles.button]} 
          onPress={handleTutorialPress}
        >
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
            {translate('tutorial')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, dynamicStyles.button]}
          onPress={() => navigation.navigate("Support")}
        >
          <Text style={[styles.buttonText, dynamicStyles.buttonText]}>
            {translate('support')}
          </Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={isLanguageModalVisible}
          onRequestClose={() => setLanguageModalVisible(false)}
        >
          <View style={modalStyles.modalContainer}>
            <View style={modalStyles.modalContent}>
              <Text style={modalStyles.modalTitle}>{translate('selectLanguage')}</Text>
              <TouchableOpacity onPress={() => handleLanguageChange("es")}>
                <Text style={modalStyles.modalOption}>{translate('spanish')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleLanguageChange("en")}>
                <Text style={modalStyles.modalOption}>{translate('english')}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLanguageModalVisible(false)}>
                <Text style={modalStyles.modalCancel}>{translate('cancel')}</Text>
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