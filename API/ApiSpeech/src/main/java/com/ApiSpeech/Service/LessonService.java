package com.ApiSpeech.Service;

import com.ApiSpeech.Dto.LessonCreationDto;
import com.ApiSpeech.Dto.LessonMinimalDto;
import com.ApiSpeech.Dto.LessonUpdateDto;
import com.ApiSpeech.Model.Lesson;
import com.ApiSpeech.Model.Test;

import java.util.List;

public interface LessonService {
    Lesson create(LessonCreationDto lesson);

    List<Lesson> createBulk(List<LessonCreationDto> lessons);

    List<Lesson> getAll();

    Lesson getById(String id);

    List<Lesson> getByFilters(String englishLevel, String languagePreference, String specificArea, Integer unit);

    Lesson update(String id, LessonUpdateDto lessonUpdateDto);

    void delete(String id);

    List<Test> getQuestionsByUnit(int unit, String languagePreference, String specificArea);

    List<LessonMinimalDto> getMinimalLessonsByFilters(
            String languagePreference,
            String specificArea,
            Integer unit);
}
