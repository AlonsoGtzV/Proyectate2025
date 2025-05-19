package com.ApiSpeech.Service;

import com.ApiSpeech.Model.Lesson;
import com.ApiSpeech.Repository.LessonRepository;
import com.ApiSpeech.Exception.LessonNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.StreamSupport;

@Service
public class LessonServiceImpl implements LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    @Override
    public Lesson create(Lesson lesson) {
        if (lesson.getUnit() == null) {
            throw new IllegalArgumentException("El campo 'unit' es obligatorio.");
        }
        return lessonRepository.save(lesson);
    }

    @Override
    public Lesson getById(Long id) {
        return lessonRepository.findById(id.toString())
                .orElseThrow(() -> new LessonNotFoundException("Lección con ID " + id + " no encontrada."));
    }

    @Override
    public List<Lesson> getAll() {
        return StreamSupport.stream(lessonRepository.findAll().spliterator(), false)
                .map(lesson -> {
                    if (lesson.getUnit() == null) {
                        lesson.setUnit(0); // Valor predeterminado si no está definido
                    }
                    return lesson;
                })
                .toList();
    }


    @Override
    public List<Lesson> getByFilters(String englishLevel, String languagePreference, String specificArea, String professionalismLevel) {
        List<Lesson> lessons = lessonRepository.findByFilters(englishLevel, languagePreference, specificArea, professionalismLevel);
        if (lessons.isEmpty()) {
            throw new LessonNotFoundException("No se encontraron lecciones con los filtros proporcionados.");
        }
        return lessons;
    }
    @Override
    public Lesson update(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    @Override
    public void delete(Long id) {

        if (!lessonRepository.existsById(id.toString())) {
            throw new LessonNotFoundException("Lección con ID " + id.toString() + " no encontrada.");
        }
        lessonRepository.deleteById(id.toString());
    }
    @Override
    public List<Lesson.Test> getQuestionsByUnit(int unit, String englishLevel, String languagePreference, String specificArea) {
        return StreamSupport.stream(lessonRepository.findAll().spliterator(), false)
                .filter(lesson -> lesson.getUnit() != null && lesson.getUnit() == unit)
                .filter(lesson -> englishLevel == null || englishLevel.equals(lesson.getEnglishLevel()))
                .filter(lesson -> languagePreference == null || languagePreference.equals(lesson.getLanguagePreference()))
                .filter(lesson -> specificArea == null || specificArea.equals(lesson.getSpecificArea()))
                .flatMap(lesson -> lesson.getTest().stream())
                .toList();
    }
}
