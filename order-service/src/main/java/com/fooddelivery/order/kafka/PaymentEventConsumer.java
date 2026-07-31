package com.fooddelivery.order.kafka;

import com.fooddelivery.order.event.PaymentEvent;
import com.fooddelivery.order.model.Order;
import com.fooddelivery.order.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentEventConsumer {
    private final OrderRepository orderRepository;

    @KafkaListener(topics = "payment-events", groupId = "order-group")
    public void consumePaymentEvent(PaymentEvent paymentEvent) {
        log.info("Received PaymentEvent: {}", paymentEvent);
        Optional<Order> orderOpt = orderRepository.findById(paymentEvent.getOrderId());
        if (orderOpt.isPresent()) {
            Order order = orderOpt.get();
            if ("SUCCESS".equals(paymentEvent.getStatus())) {
                order.setStatus("PAID");
            } else if ("FAILED".equals(paymentEvent.getStatus())) {
                order.setStatus("CANCELLED");
            }
            orderRepository.save(order);
            log.info("Updated Order {} to status {}", order.getId(), order.getStatus());
        } else {
            log.warn("Order not found for PaymentEvent: {}", paymentEvent);
        }
    }
}
