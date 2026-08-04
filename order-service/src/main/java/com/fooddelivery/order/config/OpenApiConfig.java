package com.fooddelivery.order.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("FlavorDash Food Delivery API 🍔")
                        .version("1.0.0")
                        .description("Swagger OpenAPI documentation for FlavorDash Order Management, VIP Table Reservations, and Real-Time SMS/Email Notifications.")
                        .contact(new Contact()
                                .name("Chaithanya Gowda")
                                .email("chaithanyagowda762@gmail.com")
                                .url("https://github.com/chaithanya762/flavordash-food-delivery"))
                        .license(new License().name("Apache 2.0").url("https://springdoc.org")))
                .servers(List.of(
                        new Server().url("http://localhost:8083").description("Order Service Direct Endpoint"),
                        new Server().url("http://localhost:8080").description("API Gateway Endpoint")
                ));
    }
}
