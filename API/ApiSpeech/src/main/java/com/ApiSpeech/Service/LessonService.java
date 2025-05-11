package com.ApiSpeech.Service;

import com.ApiSpeech.Model.Lesson;

import java.util.List;

public interface LessonService {
    Lesson create(Lesson lesson);
    List<Lesson> getAll();
    Lesson getById(Long id);
    List<Lesson> getByFilters(String englishLevel, String languagePreference, String specificArea, String professionalismLevel);
    Lesson update(Lesson lesson);
    void delete(Long id);
}
