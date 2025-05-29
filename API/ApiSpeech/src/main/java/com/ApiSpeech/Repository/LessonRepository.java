package com.ApiSpeech.Repository;

import com.ApiSpeech.Dto.LessonMinimalDto;
import com.ApiSpeech.Model.Lesson;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LessonRepository extends JpaRepository<Lesson, String> {

    // Query personalizada para filtros
    @Query("SELECT l FROM Lesson l WHERE " +
            "(:englishLevel IS NULL OR l.englishLevel = :englishLevel) AND " +
            "(:languagePreference IS NULL OR l.languagePreference = :languagePreference) AND " +
            "(:specificArea IS NULL OR l.specificArea = :specificArea) AND " +
            "(:unit IS NULL OR l.unit = :unit)")

    List<Lesson> findByFilters(
            @Param("englishLevel") String englishLevel,
            @Param("languagePreference") String languagePreference,
            @Param("specificArea") String specificArea,
            @Param("unit") Integer unit);

    @Query("SELECT NEW com.ApiSpeech.Dto.LessonMinimalDto(" +
            "l.id, lc.title, lc.text, l.languagePreference, " +
            "l.specificArea, l.unit) " +
            "FROM Lesson l JOIN l.lessonContent lc WHERE " +
            "(:languagePreference IS NULL OR l.languagePreference = :languagePreference) AND " +
            "(:specificArea IS NULL OR l.specificArea = :specificArea) AND " +
            "(:unit IS NULL OR l.unit = :unit)")
    List<LessonMinimalDto> findMinimalLessonsByFilters(
            @Param("languagePreference") String languagePreference,
            @Param("specificArea") String specificArea,
            @Param("unit") Integer unit);
}

