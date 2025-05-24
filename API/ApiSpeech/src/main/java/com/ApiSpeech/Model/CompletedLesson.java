package com.ApiSpeech.Model;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class CompletedLesson {

    @Column(name = "lesson_id")
    private String lessonId;

    @Column(name = "lesson_name")
    private String lessonName;

    // Getters y setters
    public String getLessonId() {
        return lessonId;
    }

    public void setLessonId(String lessonId) {
        this.lessonId = lessonId;
    }

    public String getLessonName() {
        return lessonName;
    }

    public void setLessonName(String lessonName) {
        this.lessonName = lessonName;
    }
}