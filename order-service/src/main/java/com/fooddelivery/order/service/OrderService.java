package com.fooddelivery.order.service;

import com.fooddelivery.order.client.ProductClient;
import com.fooddelivery.order.client.UserClient;
import com.fooddelivery.order.dto.OrderRequest;
import com.fooddelivery.order.dto.OrderResponse;
import com.fooddelivery.order.dto.ProductResponse;
import com.fooddelivery.order.dto.UserResponse;
import com.fooddelivery.order.event.OrderEvent;
import com.fooddelivery.order.kafka.OrderEventProducer;
import com.fooddelivery.order.model.Order;
import com.fooddelivery.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserClient userClient;
    private final ProductClient productClient;
    private final OrderEventProducer orderEventProducer;

    public OrderResponse createOrder(OrderRequest request) {
        UserResponse user;
        try {
            user = userClient.getUserById(request.getUserId());
        } catch (Exception e) {
            log.error("User validation failed", e);
            throw new RuntimeException("User not found or User Service unavailable");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<String> productNames = new ArrayList<>();

        for (Long productId : request.getProductIds()) {
            ProductResponse product = productClient.getProductById(productId);
            totalAmount = totalAmount.add(product.getPrice());
            productNames.add(product.getName());
        }

        Order order = Order.builder()
                .userId(request.getUserId())
                .productIds(request.getProductIds())
                .deliveryAddress(request.getDeliveryAddress())
                .totalAmount(totalAmount)
                .status("PENDING")
                .build();

        order = orderRepository.save(order);

        OrderEvent orderEvent = OrderEvent.builder()
                .orderId(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .createdAt(order.getCreatedAt())
                .build();
        
        orderEventProducer.sendOrderEvent(orderEvent);

        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .userName(user.getName())
                .productNames(productNames)
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .createdAt(order.getCreatedAt())
                .build();
    }

    public OrderResponse getOrderById(Long id) {
        Order order = orderRepository.findById(id).orElseThrow(() -> new RuntimeException("Order not found"));
        return mapToResponse(order);
    }

    public List<OrderResponse> getOrdersByUserId(Long userId) {
        return orderRepository.findByUserId(userId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private OrderResponse mapToResponse(Order order) {
        return OrderResponse.builder()
                .id(order.getId())
                .userId(order.getUserId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .deliveryAddress(order.getDeliveryAddress())
                .createdAt(order.getCreatedAt())
                .build();
    }
}
