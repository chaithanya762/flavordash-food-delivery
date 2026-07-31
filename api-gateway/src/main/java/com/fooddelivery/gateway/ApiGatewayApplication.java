package com.fooddelivery.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@SpringBootApplication
@RestController
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }

    @GetMapping("/")
    public Map<String, Object> home() {
        return Map.of(
            "status", "UP",
            "service", "FlavorDash API Gateway Microservice",
            "message", "Welcome to FlavorDash Microservices Platform!",
            "author", "Chaithanya",
            "endpoints", Map.of(
                "products", "/api/products",
                "users", "/api/users",
                "orders", "/api/orders",
                "payments", "/api/payments"
            )
        );
    }
}
