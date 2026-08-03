package com.fooddelivery.order.controller;

import com.fooddelivery.order.model.TableReservation;
import com.fooddelivery.order.repository.TableReservationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final TableReservationRepository reservationRepository;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createReservation(@RequestBody TableReservation reservation) {
        TableReservation saved = reservationRepository.save(reservation);

        // SMS & Email notification status simulation
        Map<String, Object> response = new HashMap<>();
        response.put("reservation", saved);
        response.put("smsNotification", "📱 SMS dispatched to " + saved.getCustomerPhone() + ": Table at " + saved.getHotelName() + " confirmed for " + saved.getGuestCount() + " guests on " + saved.getReservationDate() + " at " + saved.getReservationTime());
        response.put("emailNotification", "✉️ Confirmation email sent to " + saved.getCustomerEmail() + " with booking ref #" + saved.getId());
        response.put("status", "SUCCESS");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<TableReservation>> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }

    @GetMapping("/hotel/{hotelName}")
    public ResponseEntity<List<TableReservation>> getReservationsByHotel(@PathVariable("hotelName") String hotelName) {
        return ResponseEntity.ok(reservationRepository.findByHotelName(hotelName));
    }

    @GetMapping("/phone/{phone}")
    public ResponseEntity<List<TableReservation>> getReservationsByPhone(@PathVariable("phone") String phone) {
        return ResponseEntity.ok(reservationRepository.findByCustomerPhone(phone));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> cancelReservation(@PathVariable("id") Long id) {
        reservationRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Reservation #" + id + " cancelled successfully.");
        return ResponseEntity.ok(response);
    }
}
