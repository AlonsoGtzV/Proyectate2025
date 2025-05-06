package com.ApiSpeech.Controller;

import com.ApiSpeech.Model.Lesson;
import com.ApiSpeech.Service.LessonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lessons")
public class LessonController {

    @Autowired
    private LessonService lessonService;

    @PostMapping
    public Lesson create(@RequestBody Lesson lesson) {
        return lessonService.create(lesson);
    }

    @GetMapping
    public List<Lesson> getAll() {
        return lessonService.getAll();
    }

    @GetMapping("/{id}")
    public Lesson getById(@PathVariable Long id) {
        return lessonService.getById(id);
    }
}
