package com.pos.backend.controller;

import com.pos.backend.dto.DashboardStatsDTO;
import com.pos.backend.repository.OrderRepository;
import com.pos.backend.repository.ProductRepository;
import com.pos.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/stats")
    public DashboardStatsDTO getDashboardStats() {
        Double totalRevenue = orderRepository.getTotalRevenue();
        Long totalOrders = orderRepository.count();
        Long totalProducts = productRepository.count();
        Long totalUsers = userRepository.count();

        return new DashboardStatsDTO(totalRevenue, totalOrders, totalProducts, totalUsers);
    }
}
