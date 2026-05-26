package com.pos.backend.repository;

import com.pos.backend.model.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import com.pos.backend.dto.ProductSalesDTO;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    
    @Query("SELECT new com.pos.backend.dto.ProductSalesDTO(p.id, p.name, SUM(oi.quantity), p.stock) " +
           "FROM OrderItem oi JOIN oi.product p GROUP BY p.id, p.name, p.stock ORDER BY SUM(oi.quantity) DESC")
    List<ProductSalesDTO> getProductSales();
}
