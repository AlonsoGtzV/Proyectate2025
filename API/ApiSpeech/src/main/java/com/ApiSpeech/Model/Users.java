package com.ApiSpeech.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cognitoUsername; // ID del usuario en Cognito

    private String englishLevel;
    private String languagePreference;
    private String specificArea;
    private String professionalismLevel;

    // Getters y setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCognitoUsername() {
        return cognitoUsername;
    }

    public void setCognitoUsername(String cognitoUsername) {
        this.cognitoUsername = cognitoUsername;
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

    public String getProfessionalismLevel() {
        return professionalismLevel;
    }

    public void setProfessionalismLevel(String professionalismLevel) {
        this.professionalismLevel = professionalismLevel;
    }
}
