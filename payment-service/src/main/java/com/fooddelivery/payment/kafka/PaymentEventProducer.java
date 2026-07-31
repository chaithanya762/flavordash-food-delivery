package com.fooddelivery.payment.kafka;

import com.fooddelivery.payment.event.PaymentEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class PaymentEventProducer {
    private final KafkaTemplate<String, PaymentEvent> kafkaTemplate;

    public void sendPaymentEvent(PaymentEvent paymentEvent) {
        log.info("Sending PaymentEvent: {}", paymentEvent);
        kafkaTemplate.send("payment-events", String.valueOf(paymentEvent.getOrderId()), paymentEvent);
    }
}
