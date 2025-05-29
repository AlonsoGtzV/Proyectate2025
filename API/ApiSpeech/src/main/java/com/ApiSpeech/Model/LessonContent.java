package com.ApiSpeech.Model;

import com.ApiSpeech.Model.Vocabulary;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
public class LessonContent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String text;
    private String detailedExplanation;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "vocabulary_id")
    private Vocabulary vocabulary;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public String getDetailedExplanation() {
        return detailedExplanation;
    }

    public void setDetailedExplanation(String detailedExplanation) {
        this.detailedExplanation = detailedExplanation;
    }

    public Vocabulary getVocabulary() {
        return vocabulary;
    }

    public void setVocabulary(Vocabulary vocabulary) {
        this.vocabulary = vocabulary;
    }
}