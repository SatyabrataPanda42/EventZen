package com.event.booking_service.repository;

import java.util.List;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.event.booking_service.model.Attendee;

public interface AttendeeRepository extends JpaRepository<Attendee, Long> {

    List<Attendee> findByBookingId(Long bookingId);

    long countByBookingId(Long bookingId);

    @Modifying
    @Transactional
    @Query("DELETE FROM Attendee a WHERE a.bookingId = :bookingId")
    void deleteAllByBookingId(@Param("bookingId") Long bookingId);

    @Query("""
            SELECT COUNT(a)
            FROM Attendee a
            WHERE a.bookingId IN (
                SELECT b.id FROM Booking b WHERE b.eventId = :eventId
            )
            """)
    long countByEventId(@Param("eventId") Long eventId);
}
