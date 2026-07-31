package com.fooddelivery.product.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class ProductResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private String restaurantName;
    private String category;
    private Boolean available;
    private String imageUrl;
    private LocalDateTime createdAt;
}
