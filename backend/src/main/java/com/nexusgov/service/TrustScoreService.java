// File: backend/src/main/java/com/nexusgov/service/TrustScoreService.java
package com.nexusgov.service;

import com.nexusgov.entity.User;
import com.nexusgov.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class TrustScoreService {

    private final UserRepository userRepository;

    public TrustScoreService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Retrieves a citizen's trust score. Default is 100.
     */
    public int getTrustScore(String citizenEmail) {
        if (citizenEmail == null || citizenEmail.isEmpty()) {
            return 100;
        }
        Optional<User> userOpt = userRepository.findByEmail(citizenEmail);
        return userOpt.map(user -> user.getTrustScore() != null ? user.getTrustScore() : 100).orElse(100);
    }

    /**
     * Updates a citizen's trust score based on resolution status:
     * - 'Resolved': +10 points
     * - 'Rejected': -25 points
     */
    public int updateTrustScoreForStatus(String citizenEmail, String newStatus) {
        if (citizenEmail == null || citizenEmail.isEmpty()) {
            return 100;
        }

        Optional<User> userOpt = userRepository.findByEmail(citizenEmail);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            int currentScore = user.getTrustScore() != null ? user.getTrustScore() : 100;

            if ("Resolved".equalsIgnoreCase(newStatus)) {
                currentScore += 10;
            } else if ("Rejected".equalsIgnoreCase(newStatus)) {
                currentScore -= 25;
            }

            if (currentScore < 0) currentScore = 0;
            if (currentScore > 200) currentScore = 200;

            user.setTrustScore(currentScore);
            userRepository.save(user);
            return currentScore;
        }
        return 100;
    }

    /**
     * Checks if user score is below 30 (Flag as Low Priority / Spam Warning).
     */
    public boolean isLowTrustUser(String citizenEmail) {
        return getTrustScore(citizenEmail) < 30;
    }
}
