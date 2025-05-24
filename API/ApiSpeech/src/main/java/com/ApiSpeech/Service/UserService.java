package com.ApiSpeech.Service;

import com.ApiSpeech.Model.Users;
import com.ApiSpeech.Dto.UserLoginDto;
import com.ApiSpeech.Dto.UserRegisterDto;
import com.ApiSpeech.Dto.AuthResponseDto;
import java.util.List;

public interface UserService {
    AuthResponseDto register(UserRegisterDto userDto);
    AuthResponseDto login(UserLoginDto loginDto);
    List<Users> getAll();
    Users getById(Long id);
    Users update(Users user);
    void delete(Long id);
    Users addKey(Long id);
    Users unlockUnit(Long id, Integer unitId);
    Users updateCognitoAttributes(Long id, String newEmail);
    Users addCompletedLesson(Long id, String lessonId, String LessonName);
}

