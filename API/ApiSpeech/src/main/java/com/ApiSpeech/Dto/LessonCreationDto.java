package com.ApiSpeech.Dto;

import jakarta.validation.constraints.Null;
import java.util.List;

public class LessonCreationDto {
    @Null(message = "El ID debe ser nulo para creación")
    private String id;
    private LessonContentDto lessonContent;
    private TestDto test;  // Cambiado de List<TestDto> a TestDto
    private String englishLevel;
    private String languagePreference;
    private String specificArea;
    private Integer unit;
    private List<Mp3FileDto> mp3Files;

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public LessonContentDto getLessonContent() {
        return lessonContent;
    }
    public void setLessonContent(LessonContentDto lessonContent) {
        this.lessonContent = lessonContent;
    }
    public TestDto getTest() {
        return test;
    }
    public void setTest(TestDto test) {
        this.test = test;
    }
    public String getEnglishLevel() {
        return englishLevel;
    }
    public void setEnglishLevel(String englishLevel) {
        this.englishLevel = englishLevel;
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
    public List<Mp3FileDto> getMp3Files() {
        return mp3Files;
    }
    public void setMp3Files(List<Mp3FileDto> mp3Files) {
        this.mp3Files = mp3Files;
    }
}
