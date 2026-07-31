package com.fooddelivery.product.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String description;
    private BigDecimal price;
    private String restaurantName;
    private String category;
    private String imageUrl;
}
