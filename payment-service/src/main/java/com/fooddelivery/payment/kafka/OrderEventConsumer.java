package com.fooddelivery.payment.kafka;

import com.fooddelivery.payment.event.OrderEvent;
import com.fooddelivery.payment.event.PaymentEvent;
import com.fooddelivery.payment.model.Payment;
import com.fooddelivery.payment.repository.PaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@Slf4j
@RequiredArgsConstructor
public class OrderEventConsumer {
    private final PaymentRepository paymentRepository;
    private final PaymentEventProducer paymentEventProducer;

    @KafkaListener(topics = "order-events", groupId = "payment-group")
    public void consumeOrderEvent(OrderEvent orderEvent) {
        log.info("Received OrderEvent: {}", orderEvent);
        
        try {
            Thread.sleep(1000); // Simulate processing
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }

        boolean success = Math.random() > 0.1;
        String status = success ? "SUCCESS" : "FAILED";

        Payment payment = Payment.builder()
                .orderId(orderEvent.getOrderId())
                .amount(orderEvent.getTotalAmount())
                .status(status)
                .transactionId(UUID.randomUUID().toString())
                .build();

        payment = paymentRepository.save(payment);
        log.info("Saved Payment: {}", payment);

        PaymentEvent paymentEvent = PaymentEvent.builder()
                .paymentId(payment.getId())
                .orderId(payment.getOrderId())
                .status(payment.getStatus())
                .amount(payment.getAmount())
                .processedAt(payment.getProcessedAt())
                .build();

        paymentEventProducer.sendPaymentEvent(paymentEvent);
    }
}
