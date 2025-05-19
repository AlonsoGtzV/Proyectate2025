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

    @GetMapping("/filter")
    public List<Lesson> getByFilters(
            @RequestParam(required = false) String englishLevel,
            @RequestParam(required = false) String languagePreference,
            @RequestParam(required = false) String specificArea,
            @RequestParam(required = false) String professionalismLevel) {
        return lessonService.getByFilters(englishLevel, languagePreference, specificArea, professionalismLevel);
    }
    @PutMapping("/{id}")
    public Lesson update(@PathVariable Long id, @RequestBody Lesson lesson) {
        lesson.setId(id.toString());
        return lessonService.update(lesson);
    }

    // Eliminar una lección por ID
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        lessonService.delete(id);
    }

    @GetMapping("/questions/unit/{unit}")
    public List<Lesson.Test> getQuestionsByUnit(
            @PathVariable int unit,
            @RequestParam(required = false) String englishLevel,
            @RequestParam(required = false) String languagePreference,
            @RequestParam(required = false) String specificArea) {
        return lessonService.getQuestionsByUnit(unit, englishLevel, languagePreference, specificArea);
    }
}
