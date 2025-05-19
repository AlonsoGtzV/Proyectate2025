package com.ApiSpeech.Dto;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import java.util.List;

public class UserRegisterDto {
    private String username;
    private String password;
    private String email;

    private String englishLevel;
    private String languagePreference;
    private String specificArea;
    private Integer keys;

    @ElementCollection
    private List<Integer> unlockedUnits;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

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

    public Integer getKeys() {
        return keys;
    }

    public void setKeys(Integer keys) {
        this.keys = keys;
    }
    public List<Integer> getUnlockedUnits() {
        return unlockedUnits;
    }

    public void setUnlockedUnits(List<Integer> unlockedUnits) {
        this.unlockedUnits = unlockedUnits;
    }

}
