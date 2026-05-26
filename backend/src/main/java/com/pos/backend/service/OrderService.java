package com.pos.backend.service;

import com.pos.backend.model.*;
import com.pos.backend.repository.OrderRepository;
import com.pos.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private com.pos.backend.repository.ProductRepository productRepository;

    @Autowired
    private CartService cartService;

    public Order createOrder(Long userId, String paymentMethod, List<java.util.Map<String, Object>> items) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (items == null || items.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Order order = new Order();
        order.setUser(user);
        order.setDate(LocalDateTime.now());
        order.setStatus("completed");
        order.setPaymentMethod(paymentMethod);

        double totalAmount = 0;
        for (java.util.Map<String, Object> itemReq : items) {
            Long productId = Long.valueOf(itemReq.get("id").toString());
            Integer quantity = Integer.valueOf(itemReq.get("quantity").toString());
            
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));
                
            OrderItem orderItem = new OrderItem(order, product, quantity, product.getPrice());
            order.getItems().add(orderItem);
            totalAmount += orderItem.getSubtotal();
            
            // Deduct stock statically or save via repo
            if (product.getStock() != null && product.getStock() >= quantity) {
                product.setStock(product.getStock() - quantity);
                productRepository.save(product);
            }
        }

        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }

    public List<Order> getOrderHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByDateDesc(user);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "date"));
    }
}
