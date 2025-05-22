import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';

export default function LessonRender({ lesson }) {
  const [quizStep, setQuizStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const { lessonContent, test } = lesson;

  const handleOptionPress = (option) => {
    setSelectedOption(option);
    if (option === test[quizStep].correctAnswer) {
      setScore(score + 1);
    }
    setTimeout(() => {
      if (quizStep < test.length - 1) {
        setQuizStep(quizStep + 1);
        setSelectedOption(null);
      } else {
        setShowResult(true);
      }
    }, 600);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{lessonContent.title}</Text>
      <Text style={styles.text}>{lessonContent.text}</Text>
      <Text style={styles.explanation}>{lessonContent.detailedExplanation}</Text>
      <Text style={styles.sectionTitle}>Vocabulario</Text>
      <FlatList
        data={lessonContent.vocabulary}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={styles.vocabItem}>
            <Text style={styles.term}>{item.term}:</Text>
            <Text style={styles.definition}>{item.definition}</Text>
          </View>
        )}
      />
      <Text style={styles.sectionTitle}>Quiz</Text>
      {!showResult && test.length > 0 && (
        <View style={styles.quizContainer}>
          <Text style={styles.question}>{test[quizStep].question}</Text>
          {test[quizStep].options.map((option, idx) => (
            <TouchableOpacity
              key={idx}
              style={[
                styles.option,
                selectedOption === option && styles.selectedOption
              ]}
              onPress={() => handleOptionPress(option)}
              disabled={!!selectedOption}
            >
              <Text>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
      {showResult && (
        <Text style={styles.result}>
          ¡Quiz terminado! Puntaje: {score} / {test.length}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  text: { fontSize: 16, marginBottom: 10 },
  explanation: { fontSize: 15, fontStyle: 'italic', marginBottom: 10 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 15, marginBottom: 5 },
  vocabItem: { flexDirection: 'row', marginBottom: 4 },
  term: { fontWeight: 'bold', marginRight: 5 },
  definition: { fontStyle: 'italic' },
  quizContainer: { marginTop: 15 },
  question: { fontSize: 16, marginBottom: 8 },
  option: { backgroundColor: '#eee', padding: 10, borderRadius: 8, marginBottom: 6 },
  selectedOption: { backgroundColor: '#bde4e6' },
  result: { fontSize: 18, fontWeight: 'bold', marginTop: 20, color: '#2C5E86' }
});