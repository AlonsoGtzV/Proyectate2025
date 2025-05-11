package com.ApiSpeech.Model;

            import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbBean;
            import software.amazon.awssdk.enhanced.dynamodb.mapper.annotations.DynamoDbPartitionKey;

            import java.util.List;

            @DynamoDbBean
            public class Lesson {

                private String id;
                private LessonContent lessonContent;
                private List<Test> test;
                private String englishLevel;
                private String languagePreference;
                private String specificArea;
                private String professionalismLevel;

                @DynamoDbPartitionKey
                public String getId() {
                    return id;
                }

                public void setId(String id) {
                    this.id = id;
                }

                public LessonContent getLessonContent() {
                    return lessonContent;
                }

                public void setLessonContent(LessonContent lessonContent) {
                    this.lessonContent = lessonContent;
                }

                public List<Test> getTest() {
                    return test;
                }

                public void setTest(List<Test> test) {
                    this.test = test;
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

                @DynamoDbBean
                public static class LessonContent {
                    private String title;
                    private String text;
                    private String detailedExplanation;
                    private List<Vocabulary> vocabulary;

                    public String getTitle() {
                        return title;
                    }

                    public void setTitle(String title) {
                        this.title = title;
                    }

                    public String getText() {
                        return text;
                    }

                    public void setText(String text) {
                        this.text = text;
                    }

                    public String getDetailedExplanation() {
                        return detailedExplanation;
                    }

                    public void setDetailedExplanation(String detailedExplanation) {
                        this.detailedExplanation = detailedExplanation;
                    }

                    public List<Vocabulary> getVocabulary() {
                        return vocabulary;
                    }

                    public void setVocabulary(List<Vocabulary> vocabulary) {
                        this.vocabulary = vocabulary;
                    }
                }

                @DynamoDbBean
                public static class Vocabulary {
                    private String term;
                    private String definition;

                    public String getTerm() {
                        return term;
                    }

                    public void setTerm(String term) {
                        this.term = term;
                    }

                    public String getDefinition() {
                        return definition;
                    }

                    public void setDefinition(String definition) {
                        this.definition = definition;
                    }
                }

                @DynamoDbBean
                public static class Test {
                    private String question;
                    private List<String> options;
                    private String correctAnswer;

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
                }
            }