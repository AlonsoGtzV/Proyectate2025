package com.ApiSpeech.Service;

import com.ApiSpeech.Dto.UserLoginDto;
import com.ApiSpeech.Dto.UserRegisterDto;
import com.ApiSpeech.Model.Users;
import com.ApiSpeech.Repository.UserRepository;
import com.ApiSpeech.Util.JwtUtil;
import com.ApiSpeech.Exception.UserNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

import java.util.List;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Value("${aws.cognito.userPoolId}")
    private String userPoolId;

    @Value("${aws.cognito.clientId}")
    private String clientId;

    private final CognitoIdentityProviderClient cognitoClient;

    public UserServiceImpl() {
        this.cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.US_EAST_1) // cámbialo si tu región es otra
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }

    @Override
    public Users register(UserRegisterDto dto) {
        // 1. Registro en Cognito
        SignUpRequest signUpRequest = SignUpRequest.builder()
                .clientId(clientId)
                .username(dto.getUsername())
                .password(dto.getPassword())
                .userAttributes(AttributeType.builder().name("email").value(dto.getEmail()).build())
                .build();

        try {
            cognitoClient.signUp(signUpRequest);
            AdminConfirmSignUpRequest confirmRequest = AdminConfirmSignUpRequest.builder()
                    .userPoolId(userPoolId)
                    .username(dto.getUsername())
                    .build();
            cognitoClient.adminConfirmSignUp(confirmRequest);
        } catch (UsernameExistsException e) {
            throw new RuntimeException("El usuario ya existe en Cognito.");
        } catch (CognitoIdentityProviderException e) {
            throw new RuntimeException("Error en Cognito: " + e.awsErrorDetails().errorMessage());
        }

        // 2. Guardar configuración adicional en RDS
        Users user = new Users();
        user.setCognitoUsername(dto.getUsername());
        user.setEnglishLevel(dto.getEnglishLevel());
        user.setLanguagePreference(dto.getLanguagePreference());
        user.setSpecificArea(dto.getSpecificArea());
        user.setProfessionalismLevel(dto.getProfessionalismLevel());

        return userRepository.save(user);
    }

    @Override
    public String login(UserLoginDto dto) {
        // 1. Autenticación con Cognito
        try {
            InitiateAuthRequest authRequest = InitiateAuthRequest.builder()
                    .authFlow(AuthFlowType.USER_PASSWORD_AUTH) // Cambiar flujo de autenticación
                    .clientId(clientId)
                    .authParameters(Map.of(
                            "USERNAME", dto.getUsername(),
                            "PASSWORD", dto.getPassword()
                    ))
                    .build();

            cognitoClient.initiateAuth(authRequest);
        } catch (NotAuthorizedException e) {
            throw new RuntimeException("Usuario o contraseña incorrectos.");
        } catch (UserNotFoundException e) {
            throw new RuntimeException("El usuario no existe.");
        } catch (CognitoIdentityProviderException e) {
            throw new RuntimeException("Error al autenticar con Cognito: " + e.awsErrorDetails().errorMessage());
        }

        // 2. Buscar configuración del usuario
        return jwtUtil.generateToken(dto.getUsername());
    }

    @Override
    public List<Users> getAll() {
        // Verificar que la conexión a la base de datos esté configurada correctamente
        return userRepository.findAll();
    }
    @Override
    public Users getById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("Usuario con ID " + id + " no encontrado."));
    }

    @Override
    public Users update(Users user) {
        if (!userRepository.existsById(user.getId())) {
            throw new RuntimeException("Usuario no encontrado");
        }
        return userRepository.save(user);
    }

    @Override
    public void delete(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("Usuario con ID " + id + " no encontrado.");
        }
        userRepository.deleteById(id);
    }
}
