package com.ApiSpeech.Controller;

import com.ApiSpeech.Dto.LessonCreationDto;
import com.ApiSpeech.Dto.LessonMinimalDto;
import com.ApiSpeech.Dto.LessonUpdateDto;
import com.ApiSpeech.Model.Lesson;
import com.ApiSpeech.Model.Test;
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
    public Lesson create(@RequestBody LessonCreationDto lesson) {
        return lessonService.create(lesson);
    }

    @PostMapping("/bulk")
    public List<Lesson> createBulk(@RequestBody List<LessonCreationDto> lessons) {
        return lessonService.createBulk(lessons);
    }

    @GetMapping
    public List<Lesson> getAll() {
        return lessonService.getAll();
    }

    @GetMapping("/{id}")
    public Lesson getById(@PathVariable String id) {
        return lessonService.getById(id);
    }

    @GetMapping("/filter")
    public List<Lesson> getByFilters(
            @RequestParam(required = false) String englishLevel,
            @RequestParam(required = true) String languagePreference,
            @RequestParam(required = true) String specificArea,
            @RequestParam(required = true) Integer unit) {
        return lessonService.getByFilters(englishLevel, languagePreference, specificArea, unit);
    }

    @PutMapping("/{id}")
    public Lesson update(@PathVariable String id, @RequestBody LessonUpdateDto lesson) {
        lesson.setId(id.toString());
        return lessonService.update(id, lesson);
    }

    // Eliminar una lección por ID
    @DeleteMapping("/{id}")
    public void delete(@PathVariable String id) {
        lessonService.delete(id);
    }

    @GetMapping("/questions/unit/{unit}")
    public List<Test> getQuestionsByUnit(
            @PathVariable int unit,
            @RequestParam(required = true) String languagePreference,
            @RequestParam(required = true) String specificArea) {
        return lessonService.getQuestionsByUnit(unit, languagePreference, specificArea);
    }
    @GetMapping("/minimal/filter")
    public List<LessonMinimalDto> getMinimalLessonsByFilters(
            @RequestParam(required = false) String languagePreference,
            @RequestParam(required = false) String specificArea,
            @RequestParam(required = false) Integer unit) {

        return lessonService.getMinimalLessonsByFilters(
                languagePreference,
                specificArea,
                unit
        );
    }
}
