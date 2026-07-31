package com.fooddelivery.order.kafka;

import com.fooddelivery.order.event.OrderEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderEventProducer {
    private final KafkaTemplate<String, OrderEvent> kafkaTemplate;

    public void sendOrderEvent(OrderEvent orderEvent) {
        log.info("Sending OrderEvent: {}", orderEvent);
        kafkaTemplate.send("order-events", String.valueOf(orderEvent.getOrderId()), orderEvent);
    }
}
