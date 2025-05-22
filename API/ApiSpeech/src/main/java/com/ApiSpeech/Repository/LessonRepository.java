package com.ApiSpeech.Repository;

import com.ApiSpeech.Model.Lesson;
import org.springframework.stereotype.Repository;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbEnhancedClient;
import software.amazon.awssdk.enhanced.dynamodb.DynamoDbTable;
import software.amazon.awssdk.enhanced.dynamodb.TableSchema;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
public class LessonRepository {

    private final DynamoDbTable<Lesson> lessonTable;

    public LessonRepository(DynamoDbClient dynamoDbClient) {
        DynamoDbEnhancedClient enhancedClient = DynamoDbEnhancedClient.builder()
                .dynamoDbClient(dynamoDbClient)
                .build();
        this.lessonTable = enhancedClient.table("lessons", TableSchema.fromBean(Lesson.class));
    }

    public Lesson save(Lesson lesson) {
        lessonTable.putItem(lesson);
        return lesson;
    }

    public Optional<Lesson> findById(String id) {
        return Optional.ofNullable(lessonTable.getItem(r -> r.key(k -> k.partitionValue(id))));
    }

    public Iterable<Lesson> findAll() {
        return lessonTable.scan().items();
    }

    public boolean existsById(String id) {
        return findById(id).isPresent();
    }

    public List<Lesson> findByFilters(String englishLevel, String languagePreference, String specificArea, Integer unit) {
        return lessonTable.scan()
                .items()
                .stream()
                .filter(lesson -> (englishLevel == null || englishLevel.equals(lesson.getEnglishLevel())) &&
                        (languagePreference == null || languagePreference.equals(lesson.getLanguagePreference())) &&
                        (specificArea == null || specificArea.equals(lesson.getSpecificArea())) &&
                        (unit == null || unit.equals(lesson.getUnit())))
                .collect(Collectors.toList());
    }
    public void deleteById(String id) {
        lessonTable.deleteItem(r -> r.key(k -> k.partitionValue(id)));
    }
}