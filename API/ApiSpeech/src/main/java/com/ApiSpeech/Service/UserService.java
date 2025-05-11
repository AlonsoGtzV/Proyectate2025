package com.ApiSpeech.Service;

import com.ApiSpeech.Model.Users;
import com.ApiSpeech.Dto.UserLoginDto;
import com.ApiSpeech.Dto.UserRegisterDto;
import java.util.List;

public interface UserService {
    Users register(UserRegisterDto userDto);
    String login(UserLoginDto loginDto);
    List<Users> getAll();
    Users getById(Long id);
    Users update(Users user);
    void delete(Long id);
}

