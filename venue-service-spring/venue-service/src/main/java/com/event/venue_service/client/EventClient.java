package com.event.venue_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "event-service", url = "http://localhost:8082")
public interface EventClient {

    @DeleteMapping("/events/venue/{venueId}")
    String deleteEventsByVenue(@PathVariable Long venueId);
}