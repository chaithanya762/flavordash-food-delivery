package com.fooddelivery.order.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long userId;
    private List<Long> productIds;
    private String deliveryAddress;
}
