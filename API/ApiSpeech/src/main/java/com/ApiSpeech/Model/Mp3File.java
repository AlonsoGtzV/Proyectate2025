package com.ApiSpeech.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Mp3File {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String fileName;

    @Lob
    @JsonIgnore
    private byte[] data;

    @ManyToOne
    @JoinColumn(name = "lesson_id")
    @JsonBackReference
    private Lesson lesson;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public byte[] getData() {
        return data;
    }

    public void setData(byte[] data) {
        this.data = data;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }

}