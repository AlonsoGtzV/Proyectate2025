package com.ApiSpeech.Service;

import com.ApiSpeech.Dto.UserLoginDto;
import com.ApiSpeech.Dto.UserRegisterDto;
import com.ApiSpeech.Model.User;
import com.ApiSpeech.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CognitoService cognitoService;

    @Override
    public User register(UserRegisterDto dto) {
        // 1. Registrar en Cognito
        cognitoService.registerUser(dto.getEmail(), dto.getPassword());

        // 2. Guardar en base de datos (RDS)
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setPassword(dto.getPassword()); // En producción debes encriptar esto
        user.setEmail(dto.getEmail());

        return userRepository.save(user);
    }

    @Override
    public User login(UserLoginDto dto) {
        User user = userRepository.findByUsername(dto.getUsername());
        if (user != null && user.getPassword().equals(dto.getPassword())) {
            return user;
        }
        return null;
    }

    @Override
    public List<User> getAll() {
        return userRepository.findAll();
    }
}
