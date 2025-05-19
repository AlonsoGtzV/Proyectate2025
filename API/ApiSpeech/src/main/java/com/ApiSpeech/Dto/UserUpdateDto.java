package com.ApiSpeech.Dto;

public class UserUpdateDto {
    private String email;
    private String englishLevel;
    private String languagePreference;
    private String specificArea;

    // Getters y setters
    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
}