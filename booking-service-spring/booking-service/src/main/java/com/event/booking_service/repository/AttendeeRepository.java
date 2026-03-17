package com.event.booking_service.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.event.booking_service.model.Attendee;

public interface AttendeeRepository extends JpaRepository<Attendee,Long>{

    List<Attendee> findByBookingId(Long bookingId);

    long countByBookingId(Long bookingId);
    
}
