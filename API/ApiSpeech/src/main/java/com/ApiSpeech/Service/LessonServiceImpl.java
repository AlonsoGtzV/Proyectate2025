package com.ApiSpeech.Service;

import com.ApiSpeech.Model.Lesson;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

public class LessonServiceImpl implements LessonService {
    private final List<Lesson> lessons = new ArrayList<>();
    private Long lessonId = 1L;

    @Override
    public Lesson create(Lesson lesson) {
        lesson.setId(lessonId++);
        lessons.add(lesson);
        return lesson;
    }

    @Override
    public List<Lesson> getAll() {
        return lessons;
    }

    @Override
    public Lesson getById(Long id) {
        return lessons.stream()
                .filter(l -> l.getId().equals(id))
                .findFirst()
                .orElse(null);
    }
}
