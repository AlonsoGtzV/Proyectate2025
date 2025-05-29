package com.ApiSpeech.Dto;

import java.util.List;

public class LessonContentDto {
    private String title;
    private String text;
    private String detailedExplanation;
    private VocabularyDto vocabulary;

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
    public VocabularyDto getVocabulary() {
        return vocabulary;
    }
    public void setVocabulary(VocabularyDto vocabulary) {
        this.vocabulary = vocabulary;
    }
}
