package com.eventservice.event_service.controller;


import com.eventservice.event_service.dto.VenueResponse;
import com.eventservice.event_service.model.Event;
import com.eventservice.event_service.service.EventService;

import jakarta.servlet.http.HttpServletRequest;

import com.eventservice.event_service.security.JwtUtil;
import com.eventservice.event_service.client.VenueClient;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/events")
public class EventController {

    private final EventService service;
    private final JwtUtil jwt;
    private final VenueClient venueClient;

    public EventController(EventService service,
                           JwtUtil jwt,
                           VenueClient venueClient){
        this.service = service;
        this.jwt = jwt;
        this.venueClient = venueClient;
    }

@PostMapping
public Event create(HttpServletRequest request,
                    @RequestBody Event event){

    String role = (String) request.getAttribute("role");
    String userId = (String) request.getAttribute("userId");

    return service.create(event, role, userId);
}

    @GetMapping
    public List<Event> getAll(){
        return service.getAll();
    }

    @GetMapping("/venue/{venueId}")
    public List<Event> getByVenue(@PathVariable Long venueId){
        return service.getByVenue(venueId);
    }

    @PutMapping("/{id}")
    public Event update(HttpServletRequest request,
                        @PathVariable Long id,
                        @RequestBody Event event){

        String role = (String) request.getAttribute("role");
        String userId = (String) request.getAttribute("userId");

        return service.update(id,event,role,userId);
    }

    @DeleteMapping("/{id}")
    public String delete(@RequestHeader("Authorization") String token,
                         @PathVariable Long id){

        String role=jwt.getRole(token);
        String userId=jwt.getUserId(token);

        service.delete(id,role,userId);

        return "Event deleted successfully";
    }
    @GetMapping("/debug")
public String debug(@RequestHeader("Authorization") String token){

    return "UserId=" + jwt.getUserId(token) + " Role=" + jwt.getRole(token);
}
@GetMapping("/testVenue/{id}")
public VenueResponse testVenue(@PathVariable Long id){

    System.out.println("Controller reached");

    return venueClient.getVenue(id);
}
@GetMapping("/hello")
public String hello(){
    return "Event service running";
}
@GetMapping("/{id}")
public Event getById(
        @RequestHeader(value="Authorization", required=false) String token,
        @PathVariable Long id){

    System.out.println("TOKEN RECEIVED: " + token);

    return service.getById(id);
}
}
