package com.fooddelivery.product.config;

import com.fooddelivery.product.model.Product;
import com.fooddelivery.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository productRepository;

    @Override
    public void run(String... args) throws Exception {
        if (productRepository.count() == 0) {
            List<Product> initialProducts = List.of(
                    Product.builder()
                            .name("Margherita Pizza")
                            .description("Classic cheese and tomato pizza")
                            .price(new BigDecimal("12.99"))
                            .restaurantName("Pizza Palace")
                            .category("Pizza")
                            .imageUrl("url/margherita")
                            .build(),
                    Product.builder()
                            .name("Pepperoni Pizza")
                            .description("Pizza with pepperoni and mozzarella")
                            .price(new BigDecimal("14.99"))
                            .restaurantName("Pizza Palace")
                            .category("Pizza")
                            .imageUrl("url/pepperoni")
                            .build(),
                    Product.builder()
                            .name("Classic Cheeseburger")
                            .description("Beef patty with cheddar cheese")
                            .price(new BigDecimal("9.99"))
                            .restaurantName("Burger Barn")
                            .category("Burger")
                            .imageUrl("url/cheeseburger")
                            .build(),
                    Product.builder()
                            .name("Bacon Burger")
                            .description("Cheeseburger with crispy bacon")
                            .price(new BigDecimal("11.99"))
                            .restaurantName("Burger Barn")
                            .category("Burger")
                            .imageUrl("url/baconburger")
                            .build(),
                    Product.builder()
                            .name("Spicy Tuna Roll")
                            .description("Fresh tuna with spicy mayo")
                            .price(new BigDecimal("8.99"))
                            .restaurantName("Sushi Supreme")
                            .category("Sushi")
                            .imageUrl("url/spicytunaroll")
                            .build(),
                    Product.builder()
                            .name("Dragon Roll")
                            .description("Eel, cucumber, and avocado")
                            .price(new BigDecimal("13.99"))
                            .restaurantName("Sushi Supreme")
                            .category("Sushi")
                            .imageUrl("url/dragonroll")
                            .build()
            );
            productRepository.saveAll(initialProducts);
        }
    }
}
