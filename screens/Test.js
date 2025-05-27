import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';
import { useToken } from '../services/TokenContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function FinalTest({ route, navigation }) {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [loading, setLoading] = useState(true);
    const [selectedOption, setSelectedOption] = useState(null);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const { darkMode } = useTheme();
    const { translate } = useLanguage();
    const { token } = useToken();
    const { unitId } = route.params;

    const fetchQuestions = async () => {
        try {
            const userId = await AsyncStorage.getItem('userId');
            if (!userId) {
                throw new Error('No se encontró ID de usuario');
            }

            if (!token) {
                throw new Error('No se encontró token de autenticación');
            }

            const userRes = await fetch(`http://10.0.2.2:8080/api/users/${userId}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!userRes.ok) {
                const errorData = await userRes.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al obtener datos del usuario');
            }

            const userData = await userRes.json();
            if (!userData) {
                throw new Error('No se encontraron datos del usuario');
            }

            const params = new URLSearchParams({
                languagePreference: userData.languagePreference,
                specificArea: userData.specificArea
            }).toString();

            const response = await fetch(
                `http://10.0.2.2:8080/api/lessons/questions/unit/${unitId}?${params}`,
                {
                    headers: { 'Authorization': `Bearer ${token}` }
                }
            );

            if (!response.ok) {
                throw new Error('Error al cargar preguntas');
            }

            const data = await response.json();
            if (!data || data.length === 0) {
                Alert.alert(
                    translate('test.no_questions.title') || 'Sin preguntas',
                    translate('test.no_questions.message') || 'No hay preguntas disponibles para esta unidad',
                    [{ text: translate('common.back') || 'Volver', onPress: () => navigation.goBack() }]
                );
                return;
            }

            // Seleccionar 10 preguntas aleatorias
            const shuffledQuestions = data.sort(() => Math.random() - 0.5);
            const selectedQuestions = shuffledQuestions.slice(0, 5);

            if (selectedQuestions.length < 5) {
                Alert.alert(
                    translate('test.not_enough_questions.title') || 'Preguntas insuficientes',
                    translate('test.not_enough_questions.message') || 'No hay suficientes preguntas disponibles para el test',
                    [{ text: translate('common.back') || 'Volver', onPress: () => navigation.goBack() }]
                );
                return;
            }

            setQuestions(selectedQuestions);
            setLoading(false);
        } catch (error) {
            console.error('Error:', error);
            Alert.alert(
                translate('common.error') || 'Error',
                translate('test.load_error') || 'No se pudieron cargar las preguntas',
                [{ text: translate('common.back') || 'Volver', onPress: () => navigation.goBack() }]
            );
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    useEffect(() => {
        const addKeyForHighScore = async () => {
            if (showResult) {
                const percentage = Math.round((score / questions.length) * 100);
                if (percentage >= 75) {
                    try {
                        const userId = await AsyncStorage.getItem('userId');
                        const keyResponse = await fetch(`http://10.0.2.2:8080/api/users/${userId}/add-key`, {
                            method: 'PUT',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        });

                        if (keyResponse.ok) {
                            Alert.alert(
                                translate('test.success'),
                                translate('test.key_earned')
                            );
                        }
                    } catch (error) {
                        console.error('Error al procesar el resultado del test:', error);
                    }
                }
            }
        };

        addKeyForHighScore();
    }, [showResult, score, questions.length]);

    const resetTest = async () => {
        try {
            setLoading(true);
            await fetchQuestions(); // Obtener nuevas preguntas
            setCurrentQuestion(0);
            setScore(0);
            setSelectedOption(null);
            setShowResult(false);
        } catch (error) {
            console.error('Error al reiniciar el test:', error);
            Alert.alert(
                translate('common.error'),
                translate('test.reset_error') || 'Error al reiniciar el test'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleOptionSelect = (option) => {
        if (selectedOption) return;

        setSelectedOption(option);
        const isCorrect = option === questions[currentQuestion].correctAnswer;
        if (isCorrect) setScore(score + 1);

        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(null);
            } else {
                setShowResult(true);
            }
        }, 1000);
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
        quizContainer: {
            backgroundColor: darkMode ? '#1E1E1E' : 'white',
        },
        option: {
            backgroundColor: darkMode ? '#333' : '#eee',
        }
    });

    if (loading) {
        return (
            <View style={[styles.container, dynamicStyles.container, styles.centered]}>
                <ActivityIndicator size="large" color={darkMode ? '#4A90E2' : '#2C5E86'} />
                <Text style={[styles.loadingText, dynamicStyles.text]}>
                    {translate('test.loading')}
                </Text>
            </View>
        );
    }

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <SafeAreaView style={[styles.container, dynamicStyles.container]}>
                {/* Header se mantiene igual */}
                <View style={[styles.resultContainer, dynamicStyles.quizContainer]}>
                    <Ionicons
                        name="trophy"
                        size={50}
                        color={darkMode ? '#4A90E2' : '#2C5E86'}
                    />
                    <Text style={[styles.resultTitle, dynamicStyles.title]}>
                        {translate('test.completed')}
                    </Text>
                    <Text style={[styles.result, dynamicStyles.text]}>
                        {translate('test.score')}: {score} / {questions.length}
                    </Text>
                    <Text style={[styles.percentage, dynamicStyles.sectionTitle]}>
                        {percentage}%
                    </Text>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[styles.button, dynamicStyles.button]}
                            onPress={resetTest}
                        >
                            <Text style={styles.buttonText}>
                                {translate('test.try_again')}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.button, dynamicStyles.button]}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.buttonText}>
                                {translate('common.back')}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, dynamicStyles.container]}>
            <View style={[styles.header, dynamicStyles.header]}>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={styles.backButton}
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    {translate('test.question')} {currentQuestion + 1} {translate('test.of')} {questions.length}
                </Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView style={styles.content}>
                <View style={[styles.quizContainer, dynamicStyles.quizContainer]}>
                    <Text style={[styles.question, dynamicStyles.text]}>
                        {questions[currentQuestion].question}
                    </Text>

                    {questions[currentQuestion].options.map((option, index) => {
                        let optionStyle = [styles.option, dynamicStyles.option];

                        if (selectedOption) {
                            if (option === questions[currentQuestion].correctAnswer) {
                                optionStyle.push(styles.correctOption);
                            } else if (option === selectedOption) {
                                optionStyle.push(styles.incorrectOption);
                            }
                        }

                        return (
                            <TouchableOpacity
                                key={index}
                                style={optionStyle}
                                onPress={() => handleOptionSelect(option)}
                                disabled={!!selectedOption}
                            >
                                <Text style={[styles.optionText, dynamicStyles.text]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
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
        width: 34,
    },
    content: {
        flex: 1,
        padding: 20,
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
    },
    option: {
        padding: 15,
        borderRadius: 8,
        marginBottom: 8,
    },
    optionText: {
        fontSize: 14,
    },
    correctOption: {
        backgroundColor: '#4CAF50',
    },
    incorrectOption: {
        backgroundColor: '#f44336',
    },
    resultContainer: {
        margin: 20,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    resultTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    result: {
        fontSize: 16,
        marginBottom: 5,
    },
    percentage: {
        fontSize: 24,
        fontWeight: 'bold',
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
    loadingText: {
        fontSize: 16,
        marginTop: 10,
    },
    centered: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 20,
    },
    button: {
        padding: 12,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
        backgroundColor: '#2C5E86',
    },
    buttonText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
});