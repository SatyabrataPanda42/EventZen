package com.event.booking_service.service;

import java.util.List;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.event.booking_service.client.VenueClient;
import com.event.booking_service.dto.AttendeeRequest;
import com.event.booking_service.dto.VenueResponse;
import com.event.booking_service.exception.exception.BadRequestException;
import com.event.booking_service.exception.exception.ResourceNotFoundException;
import com.event.booking_service.exception.exception.UnauthorizedException;
import com.event.booking_service.model.Attendee;
import com.event.booking_service.model.Booking;
import com.event.booking_service.repository.AttendeeRepository;
import com.event.booking_service.repository.BookingRepository;

@Service
public class AttendeeService {

    private final AttendeeRepository repo;
    private final BookingRepository bookingRepo;
    private final VenueClient venueClient;

    public AttendeeService(
            AttendeeRepository repo,
            BookingRepository bookingRepo,
            VenueClient venueClient) {

        this.repo = repo;
        this.bookingRepo = bookingRepo;
        this.venueClient = venueClient;
    }

    public Attendee add(AttendeeRequest req, String userId) {

        Booking booking = bookingRepo.findById(req.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // 🔒 OWNER CHECK
        if (!booking.getUserId().equals(userId)) {
            throw new UnauthorizedException(
                    "You can add attendees only to your booking");
        }

        // 🔒 LOCK AFTER PAYMENT
        if (booking.getStatus().equals("CONFIRMED")) {
            throw new BadRequestException("Booking is locked after payment");
        }

        VenueResponse venue = venueClient.getVenue(booking.getVenueId());

        // ✅ NEW CORRECT LOGIC (GLOBAL EVENT CAPACITY)
        long totalAttendees = repo.countByEventId(booking.getEventId());

        if (totalAttendees >= venue.getCapacity()) {
            throw new BadRequestException("Event is full");
        }

        Attendee attendee = new Attendee();

        attendee.setBookingId(req.getBookingId());
        attendee.setUserId(userId);
        attendee.setName(req.getName());
        attendee.setEmail(req.getEmail());

        return repo.save(attendee);
    }

    public void delete(Long id, String userId, String role) {

        Attendee attendee = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Attendee not found"));

        Booking booking = bookingRepo.findById(attendee.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        // 🔴 BLOCK deletion after payment
        if ("CONFIRMED".equals(booking.getStatus())) {
            throw new BadRequestException("Cannot remove attendee after payment");
        }

        // 🔐 Authorization check
        if (!"admin".equals(role) && !attendee.getUserId().equals(userId)) {
            throw new UnauthorizedException(
                    "You can delete only your attendee");
        }

        repo.delete(attendee);
    }

    public List<Attendee> getByBooking(Long bookingId, String userId) {

        Booking booking = bookingRepo.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getUserId().equals(userId)) {
            throw new UnauthorizedException("Not your booking");
        }

        return repo.findByBookingId(bookingId);
    }

    public List<Attendee> getAllAttendees(String role, String userId) {

        // ✅ ADMIN → see all
        if (role.equals("admin")) {
            return repo.findAll(Sort.by(Sort.Direction.DESC, "id"));
        }

        // ✅ CUSTOMER → only their bookings
        List<Booking> bookings = bookingRepo.findByUserId(userId);

        return bookings.stream()
                .flatMap(b -> repo.findByBookingId(b.getId()).stream())
                .toList();
    }
}