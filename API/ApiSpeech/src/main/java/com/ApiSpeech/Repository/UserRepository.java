package com.ApiSpeech.Repository;

import com.ApiSpeech.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

public interface UserRepository extends JpaRepository<Users, Long> {
    Users findByCognitoUsername(String cognitoUsername);

    @Modifying
    @Transactional
    @Query(value = "DO $$ " +
            "DECLARE " +
            "    max_id BIGINT; " +
            "BEGIN " +
            "    SELECT COALESCE(MAX(id), 0) + 1 INTO max_id FROM users; " +
            "    EXECUTE 'ALTER SEQUENCE users_id_seq RESTART WITH ' || max_id; " +
            "END $$;", nativeQuery = true)
    void resetIdSequence();
}