package com.ApiSpeech.Repository;

import com.ApiSpeech.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByCognitoUsername(String cognitoUsername);
}
