package com.pos.backend.service;

import com.pos.backend.model.User;
import com.pos.backend.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User signup(String name, String email, String password) {
        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new RuntimeException("Email is required");
        }
        if (password == null || password.length() < 6) {
            throw new RuntimeException("Password must be at least 6 characters");
        }
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already in use");
        }
        
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        
        User user = new User(name.trim(), email.trim().toLowerCase(), hashedPassword, "cashier");
        return userRepository.save(user);
    }

    public Map<String, Object> login(String email, String password) {
        if (email == null || password == null) {
            throw new RuntimeException("Email and password are required");
        }
        
        Optional<User> userOptional = userRepository.findByEmail(email.trim().toLowerCase());
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Validate password
            if (BCrypt.checkpw(password, user.getPassword())) {
                // Return user data without password
                Map<String, Object> userData = new HashMap<>();
                userData.put("id", user.getId());
                userData.put("name", user.getName());
                userData.put("email", user.getEmail());
                userData.put("role", user.getRole());
                return userData;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }
}
