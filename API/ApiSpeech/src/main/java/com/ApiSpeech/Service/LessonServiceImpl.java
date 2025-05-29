package com.ApiSpeech.Service;

import com.ApiSpeech.Dto.LessonMinimalDto;
import com.ApiSpeech.Dto.LessonUpdateDto;
import com.ApiSpeech.Model.Lesson;
import com.ApiSpeech.Model.Test;
import com.ApiSpeech.Model.LessonContent;
import com.ApiSpeech.Model.Vocabulary;
import com.ApiSpeech.Model.Mp3File;
import com.ApiSpeech.Dto.LessonCreationDto;
import java.util.Base64;
import com.ApiSpeech.Repository.LessonRepository;
import com.ApiSpeech.Exception.LessonNotFoundException;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.util.stream.Collectors;
import java.util.Objects;
import java.util.List;

@Service
@Transactional
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Override
    public Lesson create(LessonCreationDto dto) {
        Lesson lesson = new Lesson();

        // Si el ID viene en el DTO, lo asignamos
        if(dto.getId() != null && !dto.getId().isEmpty()) {
            lesson.setId(dto.getId());
        }
        // Si no viene, Hibernate generará uno automáticamente

        // Crear y asignar LessonContent
        LessonContent content = new LessonContent();
        content.setTitle(dto.getLessonContent().getTitle());
        content.setText(dto.getLessonContent().getText());
        content.setDetailedExplanation(dto.getLessonContent().getDetailedExplanation());

        // Crear y asignar Vocabulary
        Vocabulary vocabulary = new Vocabulary();
        vocabulary.setTerm(dto.getLessonContent().getVocabulary().getTerm());
        vocabulary.setDefinition(dto.getLessonContent().getVocabulary().getDefinition());
        content.setVocabulary(vocabulary);
        vocabulary.setLessonContent(content);

        lesson.setLessonContent(content);

        // Crear y asignar Test
        Test test = new Test();
        test.setQuestion(dto.getTest().getQuestion());
        test.setOptions(dto.getTest().getOptions());
        test.setCorrectAnswer(dto.getTest().getCorrectAnswer());

        // Establecer relación bidireccional
        test.setLesson(lesson);  // Primero establece la lección
        lesson.setTest(test);

        // Crear y asignar Mp3Files
        List<Mp3File> mp3Files = dto.getMp3Files().stream()
                .map(mp3Dto -> {
                    Mp3File m = new Mp3File();
                    m.setFileName(mp3Dto.getFileName());
                    m.setData(Base64.getDecoder().decode(mp3Dto.getBase64Data()));
                    m.setLesson(lesson);
                    return m;
                }).collect(Collectors.toList());

        lesson.setMp3Files(mp3Files);

        // Setear campos básicos
        lesson.setEnglishLevel(dto.getEnglishLevel());
        lesson.setLanguagePreference(dto.getLanguagePreference());
        lesson.setSpecificArea(dto.getSpecificArea());
        lesson.setUnit(dto.getUnit());

        return lessonRepository.save(lesson);
    }


    @Override
    @Transactional
    public List<Lesson> createBulk(List<LessonCreationDto> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            throw new IllegalArgumentException("La lista de lecciones no puede estar vacía.");
        }

        // Mapea cada DTO a una entidad Lesson
        List<Lesson> lessons = dtos.stream()
                .map(dto -> {
                    Lesson lesson = new Lesson();

                    if (dto.getId() != null && !dto.getId().isEmpty()) {
                        lesson.setId(dto.getId());
                    }

                    // LessonContent
                    LessonContent content = new LessonContent();
                    content.setTitle(dto.getLessonContent().getTitle());
                    content.setText(dto.getLessonContent().getText());
                    content.setDetailedExplanation(dto.getLessonContent().getDetailedExplanation());

                    // Vocabulary
                    Vocabulary vocabulary = new Vocabulary();
                    vocabulary.setTerm(dto.getLessonContent().getVocabulary().getTerm());
                    vocabulary.setDefinition(dto.getLessonContent().getVocabulary().getDefinition());
                    content.setVocabulary(vocabulary);
                    vocabulary.setLessonContent(content);

                    lesson.setLessonContent(content);

                    // Test
                    Test test = new Test();
                    test.setQuestion(dto.getTest().getQuestion());
                    test.setOptions(dto.getTest().getOptions());
                    test.setCorrectAnswer(dto.getTest().getCorrectAnswer());
                    test.setLesson(lesson);
                    lesson.setTest(test);

                    // Mp3Files
                    List<Mp3File> mp3Files = dto.getMp3Files().stream()
                            .map(mp3Dto -> {
                                Mp3File m = new Mp3File();
                                m.setFileName(mp3Dto.getFileName());
                                m.setData(Base64.getDecoder().decode(mp3Dto.getBase64Data()));
                                m.setLesson(lesson);
                                return m;
                            }).collect(Collectors.toList());

                    lesson.setMp3Files(mp3Files);

                    // Campos básicos
                    lesson.setEnglishLevel(dto.getEnglishLevel());
                    lesson.setLanguagePreference(dto.getLanguagePreference());
                    lesson.setSpecificArea(dto.getSpecificArea());
                    lesson.setUnit(dto.getUnit());

                    return lesson;
                })
                .collect(Collectors.toList());

        return lessonRepository.saveAll(lessons); // Ahora sí guarda entidades Lesson
    }

    @Override
    @Transactional(readOnly = true) // Asegura que la sesión esté activa
    public Lesson getById(String id) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new LessonNotFoundException("Lección con ID " + id + " no encontrada."));

        // Inicializa explícitamente los datos binarios dentro de la transacción
        if (lesson.getMp3Files() != null) {
            lesson.getMp3Files().forEach(mp3 -> {
                Hibernate.initialize(mp3.getData()); // Fuerza la carga del LOB
                mp3.setData(null); // Opcional: Elimina los datos binarios después de cargarlos
            });
        }

        return lesson;
    }

    @Override
    @Transactional(readOnly = true)  // La sesión permanece abierta
    public List<Lesson> getAll() {
        List<Lesson> lessons = lessonRepository.findAll();

        // Inicializa manualmente los datos binarios si es necesario
        lessons.forEach(lesson -> {
            if (lesson.getMp3Files() != null) {
                lesson.getMp3Files().forEach(mp3 -> {
                    Hibernate.initialize(mp3.getData());  // Carga el BLOB dentro de la transacción
                });
            }
        });

        return lessons;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Lesson> getByFilters(String englishLevel, String languagePreference, String specificArea, Integer unit) {
        List<Lesson> lessons = lessonRepository.findByFilters(englishLevel, languagePreference, specificArea, unit);
        if (lessons.isEmpty()) {
            throw new LessonNotFoundException("No se encontraron lecciones con los filtros proporcionados.");
        }

        // Inicializa los LOBs para cada lección
        lessons.forEach(lesson -> {
            if (lesson.getMp3Files() != null) {
                lesson.getMp3Files().forEach(mp3 -> {
                    Hibernate.initialize(mp3.getData());
                    mp3.setData(null); // Opcional
                });
            }
        });

        return lessons;
    }

    @Override
    @Transactional
    public Lesson update(String id, LessonUpdateDto dto) {
        Lesson existingLesson = lessonRepository.findById(id)
                .orElseThrow(() -> new LessonNotFoundException("Lección con ID " + id + " no encontrada."));

        // Actualizar campos básicos
        existingLesson.setEnglishLevel(dto.getEnglishLevel());
        existingLesson.setLanguagePreference(dto.getLanguagePreference());
        existingLesson.setSpecificArea(dto.getSpecificArea());
        existingLesson.setUnit(dto.getUnit());

        // Actualizar LessonContent
        if (dto.getLessonContent() != null) {
            LessonContent content = existingLesson.getLessonContent();
            content.setTitle(dto.getLessonContent().getTitle());
            content.setText(dto.getLessonContent().getText());
            content.setDetailedExplanation(dto.getLessonContent().getDetailedExplanation());

            // Actualizar Vocabulary
            Vocabulary vocabulary = content.getVocabulary();
            vocabulary.setTerm(dto.getLessonContent().getVocabulary().getTerm());
            vocabulary.setDefinition(dto.getLessonContent().getVocabulary().getDefinition());
        }

        // Actualizar Test
        if (dto.getTest() != null) {
            Test test = existingLesson.getTest();
            test.setQuestion(dto.getTest().getQuestion());
            test.setOptions(dto.getTest().getOptions());
            test.setCorrectAnswer(dto.getTest().getCorrectAnswer());
        }

        // Actualizar Mp3Files (eliminar existentes y agregar nuevos)
        if (dto.getMp3Files() != null) {
            existingLesson.getMp3Files().clear();
            List<Mp3File> newFiles = dto.getMp3Files().stream()
                    .map(mp3Dto -> {
                        Mp3File m = new Mp3File();
                        m.setFileName(mp3Dto.getFileName());
                        m.setData(Base64.getDecoder().decode(mp3Dto.getBase64Data()));
                        m.setLesson(existingLesson);
                        return m;
                    }).collect(Collectors.toList());
            existingLesson.getMp3Files().addAll(newFiles);
        }

        return lessonRepository.save(existingLesson);
    }

    @Override
    public void delete(String id) {
        if (!lessonRepository.existsById(id)) {
            throw new LessonNotFoundException("Lección con ID " + id + " no encontrada.");
        }
        lessonRepository.deleteById(id);
    }

    @Override
    public List<Test> getQuestionsByUnit(int unit, String languagePreference, String specificArea) {
        List<Lesson> lessons = lessonRepository.findByFilters(null, languagePreference, specificArea, unit);

        return lessons.stream()
                .map(Lesson::getTest) // Obtener el test de cada lección
                .filter(Objects::nonNull) // Filtrar lecciones sin test
                .collect(Collectors.toList());
    }
    @Override
    @Transactional(readOnly = true)
    public List<LessonMinimalDto> getMinimalLessonsByFilters(
            String languagePreference,
            String specificArea,
            Integer unit) {

        return lessonRepository.findMinimalLessonsByFilters(
                languagePreference,
                specificArea,
                unit
        );
    }
}