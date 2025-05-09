package com.ApiSpeech.Controller;


import com.ApiSpeech.Dto.UserLoginDto;
import com.ApiSpeech.Dto.UserRegisterDto;
import com.ApiSpeech.Model.Users;
import com.ApiSpeech.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public Users register(@RequestBody UserRegisterDto dto) {
        return userService.register(dto);
    }

    @PostMapping("/login")
    public Users login(@RequestBody UserLoginDto dto) {
        return userService.login(dto);
    }

    @GetMapping
    public List<Users> getAll() {
        return userService.getAll();
    }
}
