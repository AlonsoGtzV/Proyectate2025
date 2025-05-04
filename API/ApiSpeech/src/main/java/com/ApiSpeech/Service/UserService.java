package com.ApiSpeech.Service;

import com.ApiSpeech.Model.User;
import com.ApiSpeech.Model.Lesson;
import com.ApiSpeech.Dto.UserLoginDto;
import com.ApiSpeech.Dto.UserRegisterDto;
import java.util.List;

public interface UserService {
    User register(UserRegisterDto userDto);
    User login(UserLoginDto loginDto);
    List<User> getAll();
}

