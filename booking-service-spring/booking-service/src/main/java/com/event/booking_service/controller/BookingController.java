package com.event.booking_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.booking_service.dto.BookingRequest;
import com.event.booking_service.model.Booking;
import com.event.booking_service.service.BookingService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service){
        this.service=service;
    }

    @PostMapping
    public Booking create(HttpServletRequest request,
                          @RequestBody BookingRequest req){

        String userId=(String)request.getAttribute("userId");

        return service.create(req.getEventId(),userId);
    }

    @DeleteMapping("/{id}")
    public String cancel(HttpServletRequest request,
                         @PathVariable Long id){

        String userId=(String)request.getAttribute("userId");

        service.cancel(id,userId);

        return "Booking cancelled";
    }
    @GetMapping("/test")
    public String test(){
        return "Booking service running";
    }
    @GetMapping("/debug")
public String debug(HttpServletRequest request){
    return "userId=" + request.getAttribute("userId") +
           " role=" + request.getAttribute("role");
}
@GetMapping("/my")
public List<Booking> getMyBookings(HttpServletRequest request){

    String userId = (String) request.getAttribute("userId");

    return service.getUserBookings(userId);
}
}