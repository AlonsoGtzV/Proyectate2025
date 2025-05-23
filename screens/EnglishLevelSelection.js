// screens/LanguageSelectionScreen.jsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useTheme } from './ThemeContext';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useToken} from "../services/TokenContext";
import { useUser } from './UserContext';

export default function EnglishLevelSelection({ navigation, route }) {
  const {username, email, password, specificArea} = route.params || {};
  const [selectedLevel, setSelectedLevel] = useState(null);
  const { darkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const { setToken } = useToken();
  const {setUserInfo} = useUser();

  const handleRegister = async () => {
    const levelCategory = getLevelCategory(selectedLevel);
    setLoading(true);
    try {
      const response = await fetch('http://10.0.2.2:8080/api/users/register', {

        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          email,
          englishLevel: levelCategory,
          languagePreference: route.params?.languagePreference || null, // o el valor adecuado
          specificArea: specificArea, // o el valor adecuado
          keys: 0,
          unlockedUnits: [0]
        }),
      });
      if (!response.ok) throw new Error('Error en registro');
      const { token, userId } = await response.json();
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId.toString());
      setToken(token);
      await AsyncStorage.setItem('userData', JSON.stringify({
        username,
        email,
        englishLevel: levelCategory,
      }));
      setLoading(false);
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const levelDescriptions = {
    'A1': 'Principiante',
    'A2': 'Básico',
    'B1': 'Intermedio',
    'B2': 'Intermedio Alto',
    'C1': 'Avanzado',
    'C2': 'Experto'
  };

  const dynamicStyles = StyleSheet.create({
    container: {
      backgroundColor: darkMode ? '#121212' : '#f1f3ee',
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
    levelDescription: {
      color: darkMode ? '#BDE4E6' : '#2b64a1',
    },
    sliderTrack: {
      backgroundColor: darkMode ? '#555' : '#ccc',
    },
    sliderThumb: {
      backgroundColor: darkMode ? '#2C5E86' : '#2b64a1',
    },
    continueButton: {
      backgroundColor: darkMode ? '#2C5E86' : '#2b64a1',
    }
  });

  return (
    <View style={[styles.container, dynamicStyles.container]}>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBarBackground, dynamicStyles.sliderTrack]}>
          <View style={[styles.progressBarFill, {width: "66%"}]} />
        </View>
        <Text style={[styles.progressText, dynamicStyles.progressText]}>66% completado</Text>
      </View>

      <View style={styles.dialogContainer}>
        <Image
          source={require('../assets/Synlogo.png')}
          style={styles.avatar}
        />
        <View style={[styles.messageBox, dynamicStyles.messageBox]}>
          <Text style={[styles.messageText, dynamicStyles.messageText]}>
            Desliza para seleccionar tu nivel de inglés (A1 es el más básico y C2 es el más avanzado)
          </Text>
        </View>
      </View>

      {/* Selector de nivel con slider */}
      <View style={styles.sliderContainer}>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={5}
          step={1}
          minimumTrackTintColor={darkMode ? '#2C5E86' : '#2b64a1'}
          maximumTrackTintColor={darkMode ? '#555' : '#ccc'}
          thumbTintColor={darkMode ? '#2C5E86' : '#2b64a1'}
          onValueChange={(value) => setSelectedLevel(levels[Math.round(value)])}
        />
        
        {/* Marcadores de nivel */}
        <View style={styles.levelMarkers}>
          {levels.map((level, index) => (
            <Text 
              key={level} 
              style={[
                styles.levelMarker, 
                selectedLevel === level && styles.selectedLevelMarker,
                { color: darkMode ? '#E0E0E0' : '#333' }
              ]}
            >
              {level}
            </Text>
          ))}
        </View>
      </View>

      {/* Descripción del nivel seleccionado */}
      {selectedLevel && (
        <View style={styles.levelDescriptionContainer}>
          <Text style={[styles.levelDescription, dynamicStyles.levelDescription]}>
            {levelDescriptions[selectedLevel]} - {selectedLevel}
          </Text>
          <Text style={[styles.levelDescriptionText, { color: darkMode ? '#BDE4E6' : '#333' }]}>
            {getLevelDetails(selectedLevel)}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={[
          styles.continueButton,
          dynamicStyles.continueButton,
          !selectedLevel && { opacity: 0.5 },
        ]}
      onPress={handleRegister}
        disabled={!selectedLevel}
      >
        <Text style={styles.continueText}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

function getLevelDetails(level) {
  const details = {
    'A1': 'Puedes entender y usar expresiones cotidianas y frases básicas.',
    'A2': 'Puedes comunicarte en situaciones simples y rutinarias.',
    'B1': 'Puedes manejar la mayoría de situaciones al viajar y describir experiencias.',
    'B2': 'Puedes interactuar con fluidez y espontaneidad con hablantes nativos.',
    'C1': 'Puedes usar el idioma de manera flexible y efectiva para fines sociales y profesionales.',
    'C2': 'Puedes expresarte espontáneamente con gran precisión y diferenciar matices.'
  };
  return details[level] || '';
}

function getLevelCategory(level) {
  if (level === 'A1' || level === 'A2') return 'Beginner';
  if (level === 'B1' || level === 'B2') return 'Intermediate';
  if (level === 'C1' || level === 'C2') return 'Advanced';
  return '';
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
  sliderContainer: {
    width: '90%',
    marginVertical: 20,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  levelMarkers: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  levelMarker: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedLevelMarker: {
    color: '#2b64a1',
    fontSize: 18,
  },
  levelDescriptionContainer: {
    marginVertical: 20,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
  },
  levelDescription: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  levelDescriptionText: {
    fontSize: 14,
    textAlign: 'center',
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