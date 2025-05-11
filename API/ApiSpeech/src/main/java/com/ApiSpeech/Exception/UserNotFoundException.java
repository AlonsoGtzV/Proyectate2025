package com.ApiSpeech.Exception;

public class UserNotFoundException extends ApiException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
