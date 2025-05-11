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
        return lessonRepository.save(lesson);
    }

    @Override
    public List<Lesson> getAll() {
        return StreamSupport.stream(lessonRepository.findAll().spliterator(), false).toList();
    }

    @Override
    public Lesson getById(Long id) {
        return lessonRepository.findById(id.toString()).orElseThrow(() -> new LessonNotFoundException("Lección con ID " + id.toString() + " no encontrada."));
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
}
