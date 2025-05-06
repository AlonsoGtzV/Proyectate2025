package com.ApiSpeech.Service;

import com.ApiSpeech.Dto.UserLoginDto;
import com.ApiSpeech.Dto.UserRegisterDto;
import com.ApiSpeech.Model.User;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserServiceImpl implements UserService {
    private final List<User> users = new ArrayList<>();
    private Long idCounter = 1L;

    @Override
    public User register(UserRegisterDto dto) {
        User user = new User();
        user.setId(idCounter++);
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword());
        user.setEmail(dto.getEmail());
        users.add(user);
        return user;
    }

    @Override
    public User login(UserLoginDto dto) {
        return users.stream()
                .filter(u -> u.getUsername().equals(dto.getUsername()) && u.getPassword().equals(dto.getPassword()))
                .findFirst()
                .orElse(null);
    }

    @Override
    public List<User> getAll() {
        return users;
    }
}
