package com.ApiSpeech.Service;

import com.ApiSpeech.Dto.AuthResponseDto;
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
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

import java.util.List;
import java.util.Map;
import java.util.ArrayList;

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

    @Value("${aws.cognito.clientSecret}")
    private String clientSecret;

    private final CognitoIdentityProviderClient cognitoClient;

    public UserServiceImpl() {
        this.cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.US_EAST_1) // cámbialo si tu región es otra
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }

    private String calculateSecretHash(String username) {
        try {
            String message = username + clientId;
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(clientSecret.getBytes(), "HmacSHA256"));
            return Base64.getEncoder().encodeToString(mac.doFinal(message.getBytes()));
        } catch (Exception e) {
            throw new RuntimeException("Error al calcular el SECRET_HASH", e);
        }
    }

    @Override
    public AuthResponseDto register(UserRegisterDto dto) {
        String secretHash = calculateSecretHash(dto.getUsername());

        SignUpRequest signUpRequest = SignUpRequest.builder()
                .clientId(clientId)
                .username(dto.getUsername())
                .password(dto.getPassword())
                .userAttributes(AttributeType.builder().name("email").value(dto.getEmail()).build())
                .secretHash(secretHash)
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

        // Determinar las unidades desbloqueadas según el nivel de inglés
        List<Integer> unlockedUnits = new ArrayList<>();
        switch (dto.getEnglishLevel().toLowerCase()) {
            case "beginner":
                unlockedUnits.add(1);
                break;
            case "intermediate":
                unlockedUnits.add(1);
                unlockedUnits.add(2);
                break;
            case "advanced":
                unlockedUnits.add(1);
                unlockedUnits.add(2);
                unlockedUnits.add(3);
                break;
            default:
                throw new RuntimeException("Nivel de inglés no válido: " + dto.getEnglishLevel());
        }

        // Guardar en la base de datos
        Users user = new Users();
        user.setCognitoUsername(dto.getUsername());
        user.setEnglishLevel(dto.getEnglishLevel());
        user.setLanguagePreference(dto.getLanguagePreference() != null ? dto.getLanguagePreference() : "es");
        user.setSpecificArea(dto.getSpecificArea());
        user.setKeys(0); // Inicializar con 0 llaves
        user.setUnlockedUnits(unlockedUnits);
        userRepository.save(user);

        String token = jwtUtil.generateToken(dto.getUsername());
        return new AuthResponseDto(token, user.getId());
    }

    @Override
    public AuthResponseDto login(UserLoginDto dto) {
        // 1. Autenticación con Cognito
        try {
            InitiateAuthRequest authRequest = InitiateAuthRequest.builder()
                    .authFlow(AuthFlowType.USER_PASSWORD_AUTH) // Cambiar flujo de autenticación
                    .clientId(clientId)
                    .authParameters(Map.of(
                            "USERNAME", dto.getUsername(),
                            "PASSWORD", dto.getPassword(),
                            "SECRET_HASH", calculateSecretHash(dto.getUsername()) // Añadir el SECRET_HASH
                    ))
                    .build();

            cognitoClient.initiateAuth(authRequest);
        } catch (NotAuthorizedException e) {
            System.err.println("Error de autenticación: " + e.awsErrorDetails().errorMessage());
            throw new RuntimeException("Usuario o contraseña incorrectos.");
        }catch (UserNotFoundException e) {
            throw new RuntimeException("El usuario no existe.");
        } catch (CognitoIdentityProviderException e) {
            throw new RuntimeException("Error al autenticar con Cognito: " + e.awsErrorDetails().errorMessage());
        }

        Users user = userRepository.findByCognitoUsername(dto.getUsername());
        if (user == null) {
            throw new RuntimeException("Usuario no encontrado en la base de datos.");
        }

        String token = jwtUtil.generateToken(dto.getUsername());
        return new AuthResponseDto(token, user.getId());
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
        // Verificar si el usuario existe en la base de datos
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario con ID " + id + " no encontrado."));

        // Eliminar el usuario de Cognito
        try {
            AdminDeleteUserRequest deleteRequest = AdminDeleteUserRequest.builder()
                    .userPoolId(userPoolId)
                    .username(user.getCognitoUsername())
                    .build();
            cognitoClient.adminDeleteUser(deleteRequest);
        } catch (CognitoIdentityProviderException e) {
            throw new RuntimeException("Error al eliminar el usuario de Cognito: " + e.awsErrorDetails().errorMessage());
        }

        // Eliminar el usuario de la base de datos
        userRepository.deleteById(id);

        // Reiniciar la secuencia del ID (opcional, solo si es necesario)
        userRepository.resetIdSequence();
    }

    @Override
    public Users addKey(Long id) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario con ID " + id + " no encontrado."));
        user.setKeys(user.getKeys() + 1);
        return userRepository.save(user);
    }

    @Override
    public Users unlockUnit(Long id, Integer unitId) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario con ID " + id + " no encontrado."));
        if (user.getKeys() == null || user.getKeys() < 1) {
            throw new RuntimeException("No hay suficientes llaves para desbloquear la unidad.");
        }
        if (!user.getUnlockedUnits().contains(unitId)) {
            user.getUnlockedUnits().add(unitId);
            user.setKeys(user.getKeys() - 1);
        }
        return userRepository.save(user);
    }
    @Override
    public Users updateCognitoAttributes(Long id, String newEmail) {
        Users user = userRepository.findById(id)
                .orElseThrow(() -> new UserNotFoundException("Usuario con ID " + id + " no encontrado."));

        if (newEmail == null) {
            throw new RuntimeException("No se proporcionaron atributos para actualizar.");
        }

        try {
            AdminUpdateUserAttributesRequest updateRequest = AdminUpdateUserAttributesRequest.builder()
                    .userPoolId(userPoolId)
                    .username(user.getCognitoUsername())
                    .userAttributes(List.of(
                            AttributeType.builder().name("email").value(newEmail).build()
                    ))
                    .build();

            cognitoClient.adminUpdateUserAttributes(updateRequest);

            user.setEmail(newEmail);
            return userRepository.save(user);

        } catch (CognitoIdentityProviderException e) {
            throw new RuntimeException("Error al actualizar atributos en Cognito: " + e.awsErrorDetails().errorMessage());
        }
    }
}
