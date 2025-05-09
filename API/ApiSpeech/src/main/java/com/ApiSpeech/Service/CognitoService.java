package com.ApiSpeech.Service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.cognitoidentityprovider.CognitoIdentityProviderClient;
import software.amazon.awssdk.services.cognitoidentityprovider.model.*;

@Service
public class CognitoService {

    @Value("${aws.cognito.userPoolId}")
    private String userPoolId;

    @Value("${aws.cognito.clientId}")
    private String clientId;

    private final CognitoIdentityProviderClient cognitoClient;

    public CognitoService() {
        this.cognitoClient = CognitoIdentityProviderClient.builder()
                .region(Region.US_EAST_1)
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }

    public void registerUser(String username, String password, String email) {
        try {
            SignUpRequest signUpRequest = SignUpRequest.builder()
                    .clientId(clientId)
                    .username(username)
                    .password(password)
                    .userAttributes(
                            AttributeType.builder().name("email").value(email).build()
                    )
                    .build();

            cognitoClient.signUp(signUpRequest);

        } catch (UsernameExistsException e) {
            throw new RuntimeException("El usuario ya existe en Cognito.");
        } catch (CognitoIdentityProviderException e) {
            throw new RuntimeException("Error en Cognito: " + e.awsErrorDetails().errorMessage());
        }
    }
}
