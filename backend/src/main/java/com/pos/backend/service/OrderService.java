package com.pos.backend.service;

import com.pos.backend.model.*;
import com.pos.backend.repository.OrderRepository;
import com.pos.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

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

    @Transactional
    public Order createOrder(Long userId, String paymentMethod, List<Map<String, Object>> items) {
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
        for (Map<String, Object> itemReq : items) {
            Long productId = Long.valueOf(itemReq.get("id").toString());
            Integer quantity = Integer.valueOf(itemReq.get("quantity").toString());
            
            Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

            // Validate stock availability
            if (product.getStock() == null || product.getStock() < quantity) {
                throw new RuntimeException(
                    "Insufficient stock for product: " + product.getName() + 
                    ". Available: " + (product.getStock() != null ? product.getStock() : 0) + 
                    ", Requested: " + quantity
                );
            }
                
            OrderItem orderItem = new OrderItem(order, product, quantity, product.getPrice());
            order.getItems().add(orderItem);
            totalAmount += orderItem.getSubtotal();
            
            // Deduct stock (protected by @Transactional + @Version on Product)
            product.setStock(product.getStock() - quantity);
            productRepository.save(product);
        }

        order.setTotalAmount(totalAmount);
        return orderRepository.save(order);
    }

    @Transactional(readOnly = true)
    public List<Order> getOrderHistory(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return orderRepository.findByUserOrderByDateDesc(user);
    }

    @Transactional(readOnly = true)
    public List<Order> getAllOrders() {
        return orderRepository.findAll(org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "date"));
    }
}
