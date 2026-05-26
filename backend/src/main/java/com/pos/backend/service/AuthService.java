package com.pos.backend.service;

import com.pos.backend.model.User;
import com.pos.backend.repository.UserRepository;
import org.mindrot.jbcrypt.BCrypt;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    public User signup(String name, String email, String password) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already in use");
        }
        
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        
        User user = new User(name, email, hashedPassword, "cashier");
        return userRepository.save(user);
    }

    public User login(String email, String password) {
        Optional<User> userOptional = userRepository.findByEmail(email);
        
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            // Validate password
            if (BCrypt.checkpw(password, user.getPassword())) {
                user.setPassword(null); // Do not return password to frontend
                return user;
            }
        }
        throw new RuntimeException("Invalid email or password");
    }
}
