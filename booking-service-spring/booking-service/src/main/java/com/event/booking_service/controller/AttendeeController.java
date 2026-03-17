package com.event.booking_service.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.event.booking_service.dto.AttendeeRequest;
import com.event.booking_service.model.Attendee;
import com.event.booking_service.service.AttendeeService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/attendees")
public class AttendeeController {

    private final AttendeeService service;

    public AttendeeController(AttendeeService service){
        this.service=service;
    }

    @PostMapping
    public Attendee add(HttpServletRequest request,
                        @RequestBody AttendeeRequest req){

        String userId=(String)request.getAttribute("userId");

        return service.add(req,userId);
    }

    @DeleteMapping("/{id}")
    public String delete(HttpServletRequest request,
                         @PathVariable Long id){

        String userId=(String)request.getAttribute("userId");

        service.delete(id,userId);

        return "Attendee removed";
    }
    @GetMapping("/event/{eventId}")
public List<Attendee> getAttendeesByEvent(
        HttpServletRequest request,
        @PathVariable Long eventId){

    String userId = (String) request.getAttribute("userId");

    return service.getAttendeesByEvent(eventId,userId);
}
}
