package com.ApiSpeech.Model;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

import org.hibernate.annotations.CascadeType;
import org.hibernate.annotations.Cascade;

import java.util.List;

@Entity
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String cognitoUsername; // ID del usuario en Cognito
    private String email; // Agregar el atributo email
    private String englishLevel;
    private String languagePreference;
    private String specificArea;

    private Integer keys;

    @ElementCollection
    @CollectionTable(name = "user_unlocked_units", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "unit_id")
    @Cascade(CascadeType.DELETE)
    private List<Integer> unlockedUnits;

    @ElementCollection
    @CollectionTable(name = "user_completed_lessons", joinColumns = @JoinColumn(name = "user_id"))
    private List<CompletedLesson> completedLessons;

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

    public String getEmail() { // Getter para email
        return email;
    }

    public void setEmail(String email) { // Setter para email
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

    // Dentro de la clase Users
    public List<CompletedLesson> getCompletedLessons() {
        return completedLessons;
    }

    public void setCompletedLessons(List<CompletedLesson> completedLessons) {
        this.completedLessons = completedLessons;
    }
}