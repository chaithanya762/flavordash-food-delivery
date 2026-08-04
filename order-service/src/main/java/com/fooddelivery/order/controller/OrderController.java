package com.fooddelivery.order.controller;

import com.fooddelivery.order.dto.OrderRequest;
import com.fooddelivery.order.dto.OrderResponse;
import com.fooddelivery.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order Controller", description = "APIs for customer food order creation, status tracking, and order history")
public class OrderController {
    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Place a New Food Delivery Order", description = "Creates a new order, calculates totals, awards gamification coins, and triggers SMS/Email confirmation")
    @ApiResponse(responseCode = "201", description = "Order created successfully")
    public ResponseEntity<OrderResponse> createOrder(@RequestBody OrderRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(orderService.createOrder(request));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Order Details by Order ID", description = "Retrieves order status, items, delivery address, and driver tracking info")
    @ApiResponse(responseCode = "200", description = "Order details fetched successfully")
    public ResponseEntity<OrderResponse> getOrderById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @GetMapping("/user/{userId}")
    @Operation(summary = "Get Order History for a Customer User", description = "Fetches all past food delivery orders associated with a customer ID")
    @ApiResponse(responseCode = "200", description = "Order history retrieved successfully")
    public ResponseEntity<List<OrderResponse>> getOrdersByUserId(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
    }
}
