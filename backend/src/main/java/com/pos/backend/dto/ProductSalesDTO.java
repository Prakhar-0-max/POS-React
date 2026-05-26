package com.pos.backend.dto;

public class ProductSalesDTO {
    private Long id;
    private String name;
    private Long totalSold;
    private Integer currentStock;

    public ProductSalesDTO() {}

    public ProductSalesDTO(Long id, String name, Long totalSold, Integer currentStock) {
        this.id = id;
        this.name = name;
        this.totalSold = totalSold;
        this.currentStock = currentStock;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getTotalSold() {
        return totalSold;
    }

    public void setTotalSold(Long totalSold) {
        this.totalSold = totalSold;
    }

    public Integer getCurrentStock() {
        return currentStock;
    }

    public void setCurrentStock(Integer currentStock) {
        this.currentStock = currentStock;
    }
}
