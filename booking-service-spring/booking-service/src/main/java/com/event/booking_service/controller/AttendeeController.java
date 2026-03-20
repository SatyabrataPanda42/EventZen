package com.event.booking_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.booking_service.dto.AttendeeRequest;
import com.event.booking_service.model.Attendee;
import com.event.booking_service.service.AttendeeService;

import jakarta.servlet.http.HttpServletRequest;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/attendees")
public class AttendeeController {

    private final AttendeeService service;

    public AttendeeController(AttendeeService service) {
        this.service = service;
    }

    @PostMapping
    public Attendee add(HttpServletRequest request,
            @RequestBody AttendeeRequest req) {

        String userId = (String) request.getAttribute("userId");

        return service.add(req, userId);
    }

    @DeleteMapping("/{id}")
    public String delete(HttpServletRequest request, @PathVariable Long id) {

        String userId = (String) request.getAttribute("userId");
        String role = (String) request.getAttribute("role");

        service.delete(id, userId, role);

        return "Deleted";
    }

    @GetMapping("/booking/{bookingId}")
    public List<Attendee> getByBooking(
            @PathVariable Long bookingId,
            @RequestHeader("X-User-Id") String userId) {

        return service.getByBooking(bookingId, userId);
    }

    @GetMapping("/all")
    public List<Attendee> getAll(
            @RequestHeader("X-User-Id") String userId,
            @RequestHeader("X-User-Role") String role) {

        return service.getAllAttendees(role, userId);
    }
}
