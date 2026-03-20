package com.event.booking_service.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.event.booking_service.client.EventClient;
import com.event.booking_service.client.VenueClient;
import com.event.booking_service.dto.EventResponse;
import com.event.booking_service.dto.VenueResponse;
import com.event.booking_service.exception.exception.ResourceNotFoundException;
import com.event.booking_service.exception.exception.UnauthorizedException;
import com.event.booking_service.exception.exception.BadRequestException;

import com.event.booking_service.model.Booking;
import com.event.booking_service.repository.AttendeeRepository;
import com.event.booking_service.repository.BookingRepository;

@Service
public class BookingService {

    private final BookingRepository repo;
    private final AttendeeRepository attendeeRepo;
    private final EventClient eventClient;
    private final VenueClient venueClient;

    public BookingService(
            BookingRepository repo,
            AttendeeRepository attendeeRepo,
            EventClient eventClient,
            VenueClient venueClient) {

        this.repo = repo;
        this.eventClient = eventClient;
        this.venueClient = venueClient;
        this.attendeeRepo = attendeeRepo;
    }

    public Booking create(Long eventId, String userId) {

        if (repo.existsByEventIdAndUserIdAndStatusNot(eventId, userId, "CANCELLED")) {
            throw new BadRequestException("You already booked this event");
        }

        EventResponse event;

        try {

            event = eventClient.getEvent(eventId);

        } catch (feign.FeignException.NotFound e) {

            throw new ResourceNotFoundException("Event not found");

        } catch (Exception e) {

            throw new BadRequestException("Event service unavailable");
        }

        VenueResponse venue = venueClient.getVenue(event.getVenueId());

        long confirmed = repo.countByEventIdAndStatus(eventId, "CONFIRMED");

        Booking booking = new Booking();

        booking.setEventId(eventId);
        booking.setVenueId(event.getVenueId());
        booking.setUserId(userId);
        booking.setCreatedAt(LocalDateTime.now());
        booking.setVendorId(event.getVendorId()); // ✅ ADD THIS
        if (confirmed < venue.getCapacity()) {
            booking.setStatus("PENDING"); // ✅ allow editing
        } else {
            booking.setStatus("WAITLIST");
        }

        return repo.save(booking);
    }

    @Transactional
    public void cancel(Long id, String userId, String role) {

        Booking booking = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (role.equals("customer") && !booking.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not allowed");
        }

        // 🔥 DELETE ALL ATTENDEES
        attendeeRepo.deleteAllByBookingId(id);

        // 🔥 UPDATE STATUS
        booking.setStatus("CANCELLED");
        repo.save(booking);

        promoteWaitlist(booking.getEventId());
    }

    private void promoteWaitlist(Long eventId) {

        List<Booking> waitlist = repo.findByEventIdAndStatusOrderByCreatedAtAsc(
                eventId, "WAITLIST");

        if (waitlist.isEmpty())
            return;

        Booking next = waitlist.get(0);
        next.setStatus("PENDING"); // user still needs to pay

        repo.save(next);
    }

    public List<Booking> getUserBookings(String userId) {
        return repo.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return repo.findAll(Sort.by(Sort.Direction.DESC, "id")); // ✅ SHOW EVERYTHING
    }

    public Booking updateStatus(Long id, String role, String status) {

        Booking booking = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        status = status.toUpperCase();

        // 🔥 IF CANCELLED → DELETE ATTENDEES
        if (status.equals("CANCELLED")) {
            attendeeRepo.deleteAllByBookingId(id);
        }

        // 🔒 CONFIRMATION CHECK (keep your logic)
        if (status.equals("CONFIRMED")) {

            EventResponse event = eventClient.getEvent(booking.getEventId());
            VenueResponse venue = venueClient.getVenue(event.getVenueId());

            long confirmed = repo.countByEventIdAndStatus(
                    booking.getEventId(), "CONFIRMED");

            long attendeeCount = attendeeRepo.countByBookingId(id);

            if (confirmed + attendeeCount > venue.getCapacity()) {
                throw new BadRequestException("Not enough seats available");
            }
        }

        booking.setStatus(status);

        return repo.save(booking);
    }

    public List<Booking> getBookingsForVendor(String vendorId) {
        return repo.findByVendorId(vendorId);
    }

    @Transactional
    public void deleteBookingsByEvent(Long eventId) {

        List<Booking> bookings = repo.findByEventId(eventId);

        for (Booking b : bookings) {
            attendeeRepo.deleteAllByBookingId(b.getId()); // 🔥 delete attendees
        }

        repo.deleteAll(bookings); // 🔥 delete bookings
    }
}
