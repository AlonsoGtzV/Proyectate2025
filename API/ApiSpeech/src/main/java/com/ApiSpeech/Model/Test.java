package com.ApiSpeech.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "tests")
public class Test {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String question;

    @ElementCollection
    @CollectionTable(name = "test_options", joinColumns = @JoinColumn(name = "test_id"))
    @Column(name = "option")
    private List<String> options;

    @Column(name = "correct_answer", nullable = false)
    private String correctAnswer;

    @OneToOne  // Cambiado de @ManyToOne
    @JoinColumn(name = "lesson_id", nullable = false)
    @JsonBackReference
    private Lesson lesson;

    // Getters y setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public List<String> getOptions() {
        return options;
    }

    public void setOptions(List<String> options) {
        this.options = options;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Lesson getLesson() {
        return lesson;
    }

    public void setLesson(Lesson lesson) {
        this.lesson = lesson;
    }
}