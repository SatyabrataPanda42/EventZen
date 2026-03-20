package com.event.booking_service.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.booking_service.dto.BookingRequest;
import com.event.booking_service.model.Booking;
import com.event.booking_service.service.BookingService;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping
    public Booking create(HttpServletRequest request,
            @RequestBody BookingRequest req) {

        String userId = (String) request.getAttribute("userId");

        return service.create(req.getEventId(), userId);
    }

    @DeleteMapping("/{id}")
    public String cancel(HttpServletRequest request,
            @PathVariable Long id) {

        String userId = (String) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        service.cancel(id, userId, role);

        return "Cancelled";
    }

    @GetMapping("/test")
    public String test() {
        return "Booking service running";
    }

    @GetMapping("/debug")
    public String debug(HttpServletRequest request) {
        return "userId=" + request.getAttribute("userId") +
                " role=" + request.getAttribute("role");
    }

    @GetMapping("/my")
    public List<Booking> getMyBookings(HttpServletRequest request) {

        String userId = (String) request.getAttribute("userId");

        return service.getUserBookings(userId);
    }

    @GetMapping("/vendor")
    public List<Booking> getVendorBookings(HttpServletRequest request) {

        String vendorId = (String) request.getAttribute("userId");

        return service.getBookingsForVendor(vendorId);
    }

    @GetMapping("/all")
    public List<Booking> getAllBookings(HttpServletRequest request) {

        String role = (String) request.getAttribute("role");

        if (!"admin".equals(role)) {
            throw new RuntimeException("Unauthorized");
        }

        return service.getAllBookings();
    }

    @PutMapping("/{id}/status")
    public Booking updateStatus(HttpServletRequest request,
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {

        String role = (String) request.getAttribute("role");

        return service.updateStatus(id, role, body.get("status"));
    }

    @DeleteMapping("/event/{eventId}")
    public String deleteByEvent(@PathVariable Long eventId) {
        service.deleteBookingsByEvent(eventId);
        return "Deleted bookings for event";
    }
}