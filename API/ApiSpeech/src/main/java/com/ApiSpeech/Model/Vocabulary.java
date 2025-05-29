package com.ApiSpeech.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.databind.annotation.JsonAppend;
import jakarta.persistence.*;

@Entity
public class Vocabulary {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String term;
    private String definition;

    @OneToOne(mappedBy = "vocabulary")
    @JsonBackReference
    private LessonContent lessonContent;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTerm() {
        return term;
    }

    public void setTerm(String term) {
        this.term = term;
    }

    public String getDefinition() {
        return definition;
    }

    public void setDefinition(String definition) {
        this.definition = definition;
    }

    public LessonContent getLessonContent() {
        return lessonContent;
    }

    public void setLessonContent(LessonContent lessonContent) {
        this.lessonContent = lessonContent;
    }
}