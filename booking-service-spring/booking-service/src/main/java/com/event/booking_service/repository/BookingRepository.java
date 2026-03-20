package com.event.booking_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.event.booking_service.model.Booking;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByUserId(String userId);

    long countByEventIdAndStatus(Long eventId, String status);

    boolean existsByEventIdAndUserId(Long eventId, String userId);

    List<Booking> findByEventIdAndStatusOrderByCreatedAtAsc(
            Long eventId, String status);

    Booking findByEventIdAndUserId(Long eventId, String userId);

    List<Booking> findAll();

    List<Booking> findByEventId(Long eventId);

    List<Booking> findByStatusNot(String status);

    List<Booking> findByVendorId(String vendorId);

    boolean existsByEventIdAndUserIdAndStatusNot(
            Long eventId,
            String userId,
            String status);
}
