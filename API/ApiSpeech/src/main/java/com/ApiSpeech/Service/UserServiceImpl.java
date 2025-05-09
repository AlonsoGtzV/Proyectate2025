package com.ApiSpeech.Service;

import com.ApiSpeech.Dto.UserLoginDto;
import com.ApiSpeech.Dto.UserRegisterDto;
import com.ApiSpeech.Model.Users;
import com.ApiSpeech.Repository.UserRepository;
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
    public Users login(UserLoginDto dto) {
        // 1. Autenticación con Cognito
        try {
            AdminInitiateAuthRequest authRequest = AdminInitiateAuthRequest.builder()
                    .userPoolId(userPoolId)
                    .clientId(clientId)
                    .authFlow(AuthFlowType.ADMIN_NO_SRP_AUTH)
                    .authParameters(Map.of(
                            "USERNAME", dto.getUsername(),
                            "PASSWORD", dto.getPassword()
                    ))
                    .build();

            cognitoClient.adminInitiateAuth(authRequest);
        } catch (NotAuthorizedException e) {
            throw new RuntimeException("Usuario o contraseña incorrectos.");
        } catch (UserNotFoundException e) {
            throw new RuntimeException("El usuario no existe.");
        } catch (CognitoIdentityProviderException e) {
            throw new RuntimeException("Error al autenticar con Cognito: " + e.awsErrorDetails().errorMessage());
        }

        // 2. Buscar configuración del usuario
        return userRepository.findByCognitoUsername(dto.getUsername());
    }

    @Override
    public List<Users> getAll() {
        return userRepository.findAll();
    }
}
