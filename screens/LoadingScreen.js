// screens/LoadingScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useTheme } from './ThemeContext';
import { useLanguage } from './LanguageContext';
import { useToken } from '../services/TokenContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoadingScreen({ navigation, route }) {
    const { darkMode } = useTheme();
    const { translate } = useLanguage();
    const { token } = useToken();
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [loadingMessage, setLoadingMessage] = useState(translate("common.loading"));

    // Obtener la lección desde los parámetros de navegación
    const { lesson } = route.params || {};

    useEffect(() => {
        const loadLesson = async () => {
            try {
                // Simular progreso de carga
                setLoadingMessage(translate("lesson.preparing"));
                setLoadingProgress(25);

                // Esperar un poco para mostrar el progreso
                await new Promise(resolve => setTimeout(resolve, 800));

                setLoadingMessage(translate("lesson.loading"));
                setLoadingProgress(50);

                // Si tenemos una lección completa, proceder directamente
                if (lesson && lesson.lessonContent && lesson.test) {
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setLoadingProgress(75);

                    setLoadingMessage(translate("lesson.almost_ready"));
                    await new Promise(resolve => setTimeout(resolve, 600));
                    setLoadingProgress(100);

                    // Navegar a LessonRender con la lección
                    navigation.replace("LessonRender", { lesson });
                    return;
                }

                // Si no tenemos lección completa, cargarla desde la API
                if (lesson && lesson.id && token) {
                    const response = await fetch(`http://10.0.2.2:8080/api/lessons/${lesson.id}`, {
                        headers: { 'Authorization': `Bearer ${token}` },
                    });

                    if (!response.ok) {
                        throw new Error('Error al cargar la lección');
                    }

                    const fullLesson = await response.json();
                    setLoadingProgress(75);

                    setLoadingMessage(translate("lesson.almost_ready") || "Casi listo...");
                    await new Promise(resolve => setTimeout(resolve, 600));
                    setLoadingProgress(100);

                    // Navegar a LessonRender con la lección completa
                    navigation.replace("LessonRender", { lesson: fullLesson });
                } else {
                    // Si no hay lección o token, crear lección de ejemplo
                    await new Promise(resolve => setTimeout(resolve, 800));
                    setLoadingProgress(75);

                    const exampleLesson = {
                        lessonContent: {
                            title: lesson?.lessonContent?.title || "Lección de Ejemplo",
                            text: "Esta es una lección de ejemplo. Aquí aprenderás conceptos importantes del inglés.",
                            detailedExplanation: "Esta explicación detallada te ayudará a entender mejor el tema.",
                            vocabulary: [
                                { term: "Example", definition: "Un caso que ilustra una regla o método" },
                                { term: "Practice", definition: "Repetir una actividad para mejorar" },
                                { term: "Learn", definition: "Adquirir conocimiento o habilidad" }
                            ]
                        },
                        test: [
                            {
                                question: "¿Qué significa 'Example' en español?",
                                options: ["Ejemplo", "Práctica", "Aprender", "Enseñar"],
                                correctAnswer: "Ejemplo"
                            },
                            {
                                question: "¿Cuál es la definición correcta de 'Practice'?",
                                options: [
                                    "Adquirir conocimiento",
                                    "Repetir una actividad para mejorar",
                                    "Un caso que ilustra",
                                    "Ninguna de las anteriores"
                                ],
                                correctAnswer: "Repetir una actividad para mejorar"
                            }
                        ]
                    };

                    setLoadingMessage(translate("lesson.almost_ready") || "Casi listo...");
                    await new Promise(resolve => setTimeout(resolve, 600));
                    setLoadingProgress(100);

                    navigation.replace("LessonRender", { lesson: exampleLesson });
                }
            } catch (error) {
                console.error('Error cargando la lección:', error);

                // En caso de error, navegar con lección básica
                const basicLesson = {
                    lessonContent: {
                        title: "Error al cargar",
                        text: "No se pudo cargar la lección completa. Esta es una versión básica.",
                        detailedExplanation: "Por favor, verifica tu conexión a internet e inténtalo de nuevo.",
                        vocabulary: []
                    },
                    test: []
                };

                navigation.replace("LessonRender", { lesson: basicLesson });
            }
        };

        loadLesson();
    }, [lesson, token, navigation, translate]);

    return (
        <View style={[styles.container, { backgroundColor: darkMode ? '#121212' : '#2C5E86' }]}>
            <View style={styles.logoWrapper}>
                <Image
                    source={require('../assets/Synlogo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
            </View>

            <Text style={styles.quote}>
                {`"${translate("loading.bridgeToEnglish")}"`}
            </Text>

            {/* Barra de progreso */}
            <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${loadingProgress}%` }]} />
                </View>
                <Text style={styles.progressText}>{loadingProgress}%</Text>
            </View>

            <ActivityIndicator size="large" color="#BDE4E6" style={styles.spinner} />

            <Text style={styles.loadingText}>{loadingMessage}</Text>

            {lesson?.lessonContent?.title && (
                <Text style={styles.lessonTitle}>
                    {lesson.lessonContent.title}
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    logoWrapper: {
        backgroundColor: '#EFF1EC',
        padding: 20,
        borderRadius: 100,
        marginBottom: 40,
    },
    logo: {
        width: 80,
        height: 80,
    },
    quote: {
        fontSize: 22,
        color: 'white',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 30,
    },
    progressContainer: {
        width: '80%',
        alignItems: 'center',
        marginBottom: 20,
    },
    progressBar: {
        width: '100%',
        height: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 10,
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#BDE4E6',
        borderRadius: 4,
    },
    progressText: {
        color: 'white',
        fontSize: 14,
        fontWeight: 'bold',
    },
    loadingText: {
        fontSize: 18,
        color: 'white',
        marginTop: 10,
        textAlign: 'center',
    },
    lessonTitle: {
        fontSize: 16,
        color: '#BDE4E6',
        marginTop: 15,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    spinner: {
        marginTop: 20,
    },
});