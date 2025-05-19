// screens/LanguageSelectionScreen.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useTheme } from './ThemeContext'; // Asegúrate de tener este contexto

export default function LanguageSelectionScreen({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const { darkMode } = useTheme();

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? '#121212' : '#f1f3ee',
    },
    progressBarBackground: {
      backgroundColor: darkMode ? '#555' : '#ccc',
    },
    progressBarFill: {
      backgroundColor: darkMode ? '#2C5E86' : '#2b64a1',
    },
    progressText: {
      color: darkMode ? '#83D8E1' : '#2b64a1',
    },
    messageBox: {
      backgroundColor: darkMode ? '#333' : '#fff',
      borderColor: darkMode ? '#555' : '#000',
    },
    messageText: {
      color: darkMode ? '#E0E0E0' : '#333',
    },
    languageButton: {
      backgroundColor: darkMode ? '#2C5E86' : '#539399',
    },
    selectedButton: {
      borderColor: darkMode ? '#83D8E1' : '#2b64a1',
    },
    languageText: {
      color: darkMode ? '#E0E0E0' : '#e5e9e9',
    },
    continueButton: {
      backgroundColor: darkMode ? '#2C5E86' : '#2b64a1',
    },
    continueText: {
      color: '#fff',
    }
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBackground, dynamicStyles.progressBarBackground]}>
          <View style={[styles.progressBarFill, dynamicStyles.progressBarFill]} />
        </View>
        <Text style={[styles.progressText, dynamicStyles.progressText]}>0% completado</Text>
      </View>

      <View style={styles.dialogContainer}>
        <Image
          source={require('../assets/Synlogo.png')}
          style={styles.avatar}
        />
        <View style={[styles.messageBox, dynamicStyles.messageBox]}>
          <Text style={[styles.messageText, dynamicStyles.messageText]}>
            Hola, soy Syn, ¿en qué idioma deseas tener tu aplicación?{"\n"}
            (Puedes cambiar esto después en configuración)
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.languageButton,
          dynamicStyles.languageButton,
          selectedLanguage === 'es' && [styles.selectedButton, dynamicStyles.selectedButton],
        ]}
        onPress={() => setSelectedLanguage('es')}
      >
        <Text style={[styles.languageText, dynamicStyles.languageText]}>Español</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.languageButton,
          dynamicStyles.languageButton,
          selectedLanguage === 'en' && [styles.selectedButton, dynamicStyles.selectedButton],
        ]}
        onPress={() => setSelectedLanguage('en')}
      >
        <Text style={[styles.languageText, dynamicStyles.languageText]}>Inglés</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.continueButton,
          dynamicStyles.continueButton,
          !selectedLanguage && { opacity: 0.5 },
        ]}
        onPress={() => {
          if (selectedLanguage) {
            navigation.navigate('SpecialtySelection');
          }
        }}
        disabled={!selectedLanguage}
      >
        <Text style={[styles.continueText, dynamicStyles.continueText]}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f3ee',
    padding: 20,
    alignItems: 'center',
  },
  progressBarContainer: {
    width: '100%',
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  progressBarBackground: {
    width: '90%',
    height: 10,
    backgroundColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBarFill: {
    width: '0%',
    height: '100%',
    backgroundColor: '#2b64a1',
  },
  progressText: {
    fontSize: 16,
    color: '#2b64a1',
    fontWeight: 'bold',
  },
  dialogContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    alignItems: 'flex-start',
  },
  avatar: {
    width: 40,
    height: 40,
    marginRight: 10,
    resizeMode: 'contain',
  },
  messageBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    borderColor: '#000',
    borderWidth: 1,
  },
  messageText: {
    fontSize: 14,
    color: '#333',
  },
  languageButton: {
    width: '80%',
    padding: 15,
    backgroundColor: '#539399',
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  selectedButton: {
    borderColor: '#2b64a1',
    borderWidth: 2,
  },
  languageText: {
    color: '#e5e9e9',
    fontSize: 16,
  },
  continueButton: {
    marginTop: 30,
    backgroundColor: '#2b64a1',
    padding: 12,
    borderRadius: 8,
    width: '50%',
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
