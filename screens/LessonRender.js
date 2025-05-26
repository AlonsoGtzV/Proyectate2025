import React, { useState, useEffect } from 'react';
import {
    View,
    Alert,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';
import { useToken } from '../services/TokenContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LessonRender({ route, navigation }) {
    const [quizStep, setQuizStep] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showResult, setShowResult] = useState(false);
    const [score, setScore] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);

    const { darkMode } = useTheme();
    const { translate } = useLanguage();
    const { token } = useToken();


    useEffect(() => {
        const completeLessonIfPassed = async () => {
            if (showResult) {
                const percentage = Math.round((score / test.length) * 100);
                if (percentage >= 75) {
                    try {
                        const userId = await AsyncStorage.getItem('userId');
                        const params = new URLSearchParams({
                            lessonId: lesson.id,
                            lessonName: lesson.lessonContent.title
                        }).toString();

                        const response = await fetch(
                            `http://10.0.2.2:8080/api/users/${userId}/complete-lesson?${params}`,
                            {
                                method: 'PUT',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                    'Content-Type': 'application/json'
                                }
                            }
                        );

                        if (response.ok) {
                            Alert.alert(
                                translate('lesson.success') || '¡Felicitaciones!',
                                translate('lesson.completed_message') || '¡Has completado esta lección!',
                                    [
                                        {
                                            text: 'OK',
                                            onPress: () => navigation.navigate('Home')
                                        }
                                    ]
                            );
                        }
                    } catch (error) {
                        console.error('Error al marcar lección como completada:', error);
                    }
                }
            }
        };

        completeLessonIfPassed();
    }, [showResult, score, test?.length]);

    // Obtener la lección desde los parámetros de navegación
    const { lesson } = route.params || {};

    if (!lesson) {
        return (
            <SafeAreaView style={[styles.container, dynamicStyles.container]}>
                <Text style={[styles.errorText, dynamicStyles.text]}>
                    {translate('lesson.lesson_not_found')}
                </Text>
            </SafeAreaView>
        );
    }

    const { lessonContent, test } = lesson;

    const handleOptionPress = (option) => {
        setSelectedOption(option);
        const isCorrect = option === test[quizStep].correctAnswer;

        if (isCorrect) {
            setScore(score + 1);
        }

        setTimeout(() => {
            if (quizStep < test.length - 1) {
                setQuizStep(quizStep + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
            }
        }, 1000);
    };

    const resetQuiz = () => {
        setQuizStep(0);
        setSelectedOption(null);
        setShowResult(false);
        setScore(0);
        setShowQuiz(false);
    };

    const dynamicStyles = StyleSheet.create({
        container: {
            backgroundColor: darkMode ? '#121212' : '#EFF0EB',
        },
        header: {
            backgroundColor: darkMode ? '#1E1E1E' : '#2C5E86',
        },
        text: {
            color: darkMode ? '#E0E0E0' : '#333',
        },
        title: {
            color: darkMode ? '#E0E0E0' : '#2C5E86',
        },
        sectionTitle: {
            color: darkMode ? '#BDE4E6' : '#2C5E86',
        },
        vocabItem: {
            backgroundColor: darkMode ? '#333' : '#f8f9fa',
        },
        quizContainer: {
            backgroundColor: darkMode ? '#1E1E1E' : 'white',
        },
        option: {
            backgroundColor: darkMode ? '#333' : '#eee',
        },
        selectedOption: {
            backgroundColor: darkMode ? '#4A90E2' : '#bde4e6',
        },
        correctOption: {
            backgroundColor: '#4CAF50',
        },
        incorrectOption: {
            backgroundColor: '#f44336',
        },
    });

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            {/* Header */}
            <View style={[styles.header, dynamicStyles.header]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {lessonContent?.title || translate('lesson.lesson')}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Título de la lección */}
                <Text style={[styles.title, dynamicStyles.title]}>
                    {lessonContent?.title || translate('lesson.untitled_lesson')}
                </Text>

                {/* Contenido principal */}
                {lessonContent?.text && (
                    <Text style={[styles.text, dynamicStyles.text]}>
                        {lessonContent.text}
                    </Text>
                )}

                {/* Explicación detallada */}
                {lessonContent?.detailedExplanation && (
                    <>
                        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                            {translate('lesson.detailed_explanation')}
                        </Text>
                        <Text style={[styles.explanation, dynamicStyles.text]}>
                            {lessonContent.detailedExplanation}
                        </Text>
                    </>
                )}

                {/* Vocabulario */}
                {lessonContent?.vocabulary && lessonContent.vocabulary.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                            {translate('lesson.vocabulary')}
                        </Text>
                        {lessonContent.vocabulary.map((item, index) => (
                            <View key={index} style={[styles.vocabItem, dynamicStyles.vocabItem]}>
                                <Text style={[styles.term, dynamicStyles.title]}>
                                    {item.term}:
                                </Text>
                                <Text style={[styles.definition, dynamicStyles.text]}>
                                    {item.definition}
                                </Text>
                            </View>
                        ))}
                    </>
                )}

                {/* Botón para mostrar quiz */}
                {test && test.length > 0 && !showQuiz && !showResult && (
                    <TouchableOpacity
                        style={[styles.startQuizButton, { backgroundColor: darkMode ? '#4A90E2' : '#2C5E86' }]}
                        onPress={() => setShowQuiz(true)}
                    >
                        <Text style={styles.startQuizText}>
                            {translate('lesson.start_quiz')}
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Quiz */}
                {test && test.length > 0 && showQuiz && !showResult && (
                    <View style={[styles.quizContainer, dynamicStyles.quizContainer]}>
                        <Text style={[styles.sectionTitle, dynamicStyles.sectionTitle]}>
                            {translate('lesson.quiz') || 'Quiz'} ({quizStep + 1}/{test.length})
                        </Text>

                        <Text style={[styles.question, dynamicStyles.text]}>
                            {test[quizStep].question}
                        </Text>

                        {test[quizStep].options.map((option, idx) => {
                            let optionStyle = [styles.option, dynamicStyles.option];

                            if (selectedOption) {
                                if (option === test[quizStep].correctAnswer) {
                                    optionStyle.push(dynamicStyles.correctOption);
                                } else if (option === selectedOption && option !== test[quizStep].correctAnswer) {
                                    optionStyle.push(dynamicStyles.incorrectOption);
                                }
                            } else if (selectedOption === option) {
                                optionStyle.push(dynamicStyles.selectedOption);
                            }

                            return (
                                <TouchableOpacity
                                    key={idx}
                                    style={optionStyle}
                                    onPress={() => handleOptionPress(option)}
                                    disabled={!!selectedOption}
                                >
                                    <Text style={[styles.optionText, dynamicStyles.text]}>
                                        {option}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                )}

                {/* Resultado del quiz */}
                {showResult && (
                    <View style={[styles.resultContainer, dynamicStyles.quizContainer]}>
                        <Text style={[styles.resultTitle, dynamicStyles.title]}>
                            {translate('lesson.quiz_completed')}
                        </Text>
                        <Text style={[styles.result, dynamicStyles.text]}>
                            {translate('lesson.score')}: {score} / {test.length}
                        </Text>
                        <Text style={[styles.percentage, dynamicStyles.sectionTitle]}>
                            {Math.round((score / test.length) * 100)}%
                        </Text>

                        <TouchableOpacity
                            style={[styles.retryButton, { backgroundColor: darkMode ? '#4A90E2' : '#2C5E86' }]}
                            onPress={resetQuiz}
                        >
                            <Text style={styles.retryText}>
                                {translate('lesson.try_again')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Espaciado final */}
                <View style={styles.bottomSpacing} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFF0EB'
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C5E86',
        paddingHorizontal: 15,
        paddingVertical: 20,
        paddingTop: 40,
        justifyContent: 'space-between',
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
    },
    placeholder: {
        width: 34, // Same width as back button for centering
    },
    content: {
        flex: 1,
        padding: 20,
        marginTop: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
        color: '#2C5E86',
        textAlign: 'center',
    },
    text: {
        fontSize: 16,
        marginBottom: 15,
        lineHeight: 24,
        color: '#333',
    },
    explanation: {
        fontSize: 15,
        fontStyle: 'italic',
        marginBottom: 20,
        lineHeight: 22,
        color: '#555',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 25,
        marginBottom: 15,
        color: '#2C5E86',
    },
    vocabItem: {
        flexDirection: 'row',
        marginBottom: 8,
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#f8f9fa',
    },
    term: {
        fontWeight: 'bold',
        marginRight: 8,
        color: '#2C5E86',
    },
    definition: {
        fontStyle: 'italic',
        flex: 1,
        color: '#333',
    },
    startQuizButton: {
        backgroundColor: '#2C5E86',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    startQuizText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    quizContainer: {
        marginTop: 20,
        padding: 15,
        borderRadius: 10,
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    question: {
        fontSize: 16,
        marginBottom: 15,
        fontWeight: '500',
        color: '#333',
    },
    option: {
        backgroundColor: '#eee',
        padding: 15,
        borderRadius: 8,
        marginBottom: 8,
    },
    optionText: {
        fontSize: 14,
        color: '#333',
    },
    selectedOption: {
        backgroundColor: '#bde4e6',
    },
    correctOption: {
        backgroundColor: '#4CAF50',
    },
    incorrectOption: {
        backgroundColor: '#f44336',
    },
    resultContainer: {
        marginTop: 20,
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    resultTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#2C5E86',
    },
    result: {
        fontSize: 16,
        marginBottom: 5,
        color: '#333',
    },
    percentage: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2C5E86',
        marginBottom: 15,
    },
    retryButton: {
        backgroundColor: '#2C5E86',
        padding: 12,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
    },
    retryText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    errorText: {
        fontSize: 16,
        textAlign: 'center',
        margin: 20,
        color: '#333',
    },
    bottomSpacing: {
        height: 30,
    },
});