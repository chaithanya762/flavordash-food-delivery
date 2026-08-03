package com.fooddelivery.order.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "table_reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TableReservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private String hotelName;
    private String reservationDate;
    private String reservationTime;
    private Integer guestCount;
    private String seatingPreference;
    private String specialRequest;
    private String status; // CONFIRMED, CANCELLED, PENDING
    
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) {
            status = "CONFIRMED";
        }
    }
}
