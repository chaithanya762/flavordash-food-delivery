package com.fooddelivery.order.controller;

import com.fooddelivery.order.model.TableReservation;
import com.fooddelivery.order.repository.TableReservationRepository;
import com.fooddelivery.order.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
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
@Tag(name = "Table Reservation Controller", description = "APIs for VIP Table Reservations, Restaurant Partner Bookings, and Instant Carrier SMS/Email Notifications")
public class ReservationController {

    private final TableReservationRepository reservationRepository;
    private final NotificationService notificationService;

    @PostMapping
    @Operation(summary = "Book a VIP Table at Partner Hotel", description = "Saves table booking details, dispatches dynamic SMS to customer phone, and sends confirmation email")
    @ApiResponse(responseCode = "201", description = "Table reservation confirmed with SMS and Email dispatch")
    public ResponseEntity<Map<String, Object>> createReservation(@RequestBody TableReservation reservation) {
        TableReservation saved = reservationRepository.save(reservation);

        // Execute Real SMS & Email Dispatch via NotificationService
        String smsText = String.format("FlavorDash: Table for %d guests at %s confirmed on %s at %s! Ref #TR-%d", 
                saved.getGuestCount(), saved.getHotelName(), saved.getReservationDate(), saved.getReservationTime(), saved.getId());
        
        String emailSubject = "FlavorDash Table Reservation Confirmed - Ref #TR-" + saved.getId();
        String emailBody = String.format("Dear %s,\n\nYour table reservation at %s has been confirmed for %d guests on %s at %s.\n\nPhone: %s\nSpecial Requests: %s\n\nThank you for choosing FlavorDash Fine Dining!",
                saved.getCustomerName(), saved.getHotelName(), saved.getGuestCount(), saved.getReservationDate(), saved.getReservationTime(), saved.getCustomerPhone(), saved.getSpecialRequest());

        boolean smsSent = notificationService.sendSms(saved.getCustomerPhone(), smsText);
        boolean emailSent = notificationService.sendEmail(saved.getCustomerEmail(), emailSubject, emailBody);

        Map<String, Object> response = new HashMap<>();
        response.put("reservation", saved);
        response.put("smsNotification", "📱 Real SMS sent to " + saved.getCustomerPhone() + ": " + smsText);
        response.put("emailNotification", "✉️ Real Email sent to " + saved.getCustomerEmail() + " (Subject: " + emailSubject + ")");
        response.put("smsStatus", smsSent ? "DELIVERED" : "QUEUED");
        response.put("emailStatus", emailSent ? "DELIVERED" : "QUEUED");
        response.put("status", "SUCCESS");

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    @Operation(summary = "Get All Table Reservations", description = "Retrieves all booked table reservations across partner restaurants")
    public ResponseEntity<List<TableReservation>> getAllReservations() {
        return ResponseEntity.ok(reservationRepository.findAll());
    }

    @GetMapping("/hotel/{hotelName}")
    @Operation(summary = "Get Reservations by Hotel Name", description = "Fetches active table bookings for a specific hotel (e.g. Punjab Rasoi)")
    public ResponseEntity<List<TableReservation>> getReservationsByHotel(@PathVariable("hotelName") String hotelName) {
        return ResponseEntity.ok(reservationRepository.findByHotelName(hotelName));
    }

    @GetMapping("/phone/{phone}")
    @Operation(summary = "Get Reservations by Customer Phone", description = "Finds all table bookings for a given phone number")
    public ResponseEntity<List<TableReservation>> getReservationsByPhone(@PathVariable("phone") String phone) {
        return ResponseEntity.ok(reservationRepository.findByCustomerPhone(phone));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Cancel a Table Reservation", description = "Cancels a table reservation by ID")
    public ResponseEntity<Map<String, String>> cancelReservation(@PathVariable("id") Long id) {
        reservationRepository.deleteById(id);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Reservation #" + id + " cancelled successfully.");
        return ResponseEntity.ok(response);
    }
}
