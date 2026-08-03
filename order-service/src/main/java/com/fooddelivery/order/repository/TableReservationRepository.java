package com.fooddelivery.order.repository;

import com.fooddelivery.order.model.TableReservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TableReservationRepository extends JpaRepository<TableReservation, Long> {
    List<TableReservation> findByCustomerPhone(String customerPhone);
    List<TableReservation> findByHotelName(String hotelName);
}
