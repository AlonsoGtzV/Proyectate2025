package com.ApiSpeech.Dto;

public class LessonMinimalDto {
    private String id;
    private String title;       // Desde LessonContent
    private String text;        // Descripción (texto breve)
    private String languagePreference;
    private String specificArea;
    private Integer unit; // Opcional: filtrado adicional

    // Constructor, Getters y Setters
    public LessonMinimalDto(String id, String title, String text, String languagePreference, String specificArea, Integer unit) {
        this.id = id;
        this.title = title;
        this.text = text;
        this.languagePreference = languagePreference;
        this.specificArea = specificArea;
        this.unit = unit;
    }
    public String getId() {
        return id;
    }
    public void setId(String id) {
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
    public String getLanguagePreference() {
        return languagePreference;
    }
    public void setLanguagePreference(String languagePreference) {
        this.languagePreference = languagePreference;
    }
    public String getSpecificArea() {
        return specificArea;
    }
    public void setSpecificArea(String specificArea) {
        this.specificArea = specificArea;
    }
    public Integer getUnit() {
        return unit;
    }
    public void setUnit(Integer unit) {
        this.unit = unit;
    }
}