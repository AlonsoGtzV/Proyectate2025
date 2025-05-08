import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Asegúrate de instalar esta dependencia

const specialties = [
  "Software",
  "Bases de datos",
  "Ciencias de la Computación",
  "Redes y Comunicación",
  "Big Data",
  "Ciberseguridad",
  "Cloud",
  "IA",
];

export default function SpecialtySelectionScreen({ navigation }) {
  const [selectedSpecialty, setSelectedSpecialty] = useState(specialties[0]);

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View style={styles.progressBarFill} />
        </View>
        <Text style={styles.progressText}>10% completado</Text>
      </View>

      <View style={styles.dialogContainer}>
        <Image
          source={require('../assets/Synlogo.png')} // Coloca tu imagen en /assets
          style={styles.avatar}
        />
        <View style={styles.messageBox}>
          <Text style={styles.messageText}>
            Empecemos con algunas preguntas, ¿A qué área te vas a dedicar?
          </Text>
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedSpecialty}
          onValueChange={(itemValue) => {
            setSelectedSpecialty(itemValue);
            console.log(`Área seleccionada: ${itemValue}`);
          }}
          style={styles.picker}
        >
          {specialties.map((specialty, index) => (
            <Picker.Item key={index} label={specialty} value={specialty} />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => { 
          if(selectedSpecialty){
            navigation.navigate("Home");
          } 
        }}
      >
        <Text style={styles.continueText}>Continuar</Text>
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
