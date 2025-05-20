import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useTheme } from './ThemeContext'; // Asegúrate de tener este contexto

const specialties = [
  "Software",
  "Electrónica",
];

export default function SpecialtySelectionScreen({ navigation, route }) {
  const { username, email, password, repeatPassword, birthday } = route.params ||{};
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0]);
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
    pickerContainer: {
      backgroundColor: darkMode ? '#222' : '#fff',
      borderColor: darkMode ? '#555' : '#ccc',
    },
    picker: {
      color: darkMode ? '#E0E0E0' : '#333',
      backgroundColor: darkMode ? '#222' : '#fff',
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
          <View style={[styles.progressBarFill, dynamicStyles.progressBarFill, {width: "33%"}]} />
        </View>
        <Text style={[styles.progressText, dynamicStyles.progressText]}>33% completado</Text>
      </View>

      <View style={styles.dialogContainer}>
        <Image
          source={require('../assets/Synlogo.png')}
          style={styles.avatar}
        />
        <View style={[styles.messageBox, dynamicStyles.messageBox]}>
          <Text style={[styles.messageText, dynamicStyles.messageText]}>
            Empecemos con algunas preguntas, ¿A qué área te vas a dedicar?
          </Text>
        </View>
      </View>

      <View style={[styles.pickerContainer, dynamicStyles.pickerContainer]}>
        <Picker
          selectedValue={selectedSpecialty}
          onValueChange={(itemValue) => {
            setSelectedSpecialty(itemValue);
            console.log(`Área seleccionada: ${itemValue}`);
          }}
          style={[styles.picker, dynamicStyles.picker]}
          dropdownIconColor={darkMode ? '#BDE4E6' : '#666'}
        >
          {specialties.map((specialty, index) => (
            <Picker.Item key={index} label={specialty} value={specialty} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={[styles.continueButton, dynamicStyles.continueButton]}
        onPress={() => { 
          if(selectedSpecialty){
            navigation.navigate("Level", {
              username,
              email,
              password,
              repeatPassword,
              birthday,
              specificArea: selectedSpecialty,
            });
          } 
        }}
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
    width: '10%',
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
  pickerContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    marginTop: 20,
  },
  picker: {
    width: '100%',
    height: 50,
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
