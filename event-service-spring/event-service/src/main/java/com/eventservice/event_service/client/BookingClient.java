package com.eventservice.event_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "booking-service", url = "http://localhost:8083")
public interface BookingClient {

    @DeleteMapping("/bookings/event/{eventId}")
    String deleteBookingsByEvent(@PathVariable Long eventId);
}
