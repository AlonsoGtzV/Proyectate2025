package com.ApiSpeech.Controller;

import com.ApiSpeech.Dto.UserLoginDto;
import com.ApiSpeech.Dto.UserRegisterDto;
import com.ApiSpeech.Dto.UserUpdateDto;
import com.ApiSpeech.Model.Users;
import com.ApiSpeech.Service.UserService;
import com.ApiSpeech.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")
    public Users register(@RequestBody UserRegisterDto dto) {
        return userService.register(dto);
    }

    @PostMapping("/login")
    public String login(@RequestBody UserLoginDto dto) {
        return userService.login(dto);
    }

    @GetMapping
    public List<Users> getAll() {
        return userService.getAll();
    }

    @PutMapping("/{id}/add-key")
    public Users addKey(@PathVariable Long id) {
        return userService.addKey(id);
    }

    @PutMapping("/{id}/unlock-unit/{unitId}")
    public Users unlockUnit(@PathVariable Long id, @PathVariable Integer unitId) {
        return userService.unlockUnit(id, unitId);
    }

    @GetMapping("/{id}")
    public Users getById(@PathVariable Long id) { return userService.getById(id);}

    // Actualizar un usuario por ID
    @PutMapping("/{id}")
    public Users update(@PathVariable Long id, @RequestBody Users user) {
        user.setId(id);
        return userService.update(user);
    }

    // Eliminar un usuario por ID
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { userService.delete(id); }

    // Actualizar parcialmente un usuario por ID
    @PatchMapping("/{id}/update-partial")
    public Users updatePartial(@PathVariable Long id, @RequestBody UserUpdateDto dto) {
        Users user = userService.getById(id);

        // Verificar si se modificó el email
        if (dto.getEmail() != null && !dto.getEmail().equals(user.getEmail())) {
            user = userService.updateCognitoAttributes(id, dto.getEmail());
        }

        // Actualizar los demás campos
        if (dto.getEnglishLevel() != null) {
            user.setEnglishLevel(dto.getEnglishLevel());
        }
        if (dto.getLanguagePreference() != null) {
            user.setLanguagePreference(dto.getLanguagePreference());
        }
        if (dto.getSpecificArea() != null) {
            user.setSpecificArea(dto.getSpecificArea());
        }

        return userService.update(user);
    }

}
