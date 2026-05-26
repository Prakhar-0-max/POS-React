package com.pos.backend.controller;

import com.pos.backend.dto.ProductSalesDTO;
import com.pos.backend.repository.OrderItemRepository;
import com.pos.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/product-sales")
    public List<ProductSalesDTO> getProductSales() {
        return orderItemRepository.getProductSales();
    }

    @GetMapping("/low-stock")
    public List<com.pos.backend.model.Product> getLowStockProducts() {
        return productRepository.findByStockLessThan(5);
    }
}
