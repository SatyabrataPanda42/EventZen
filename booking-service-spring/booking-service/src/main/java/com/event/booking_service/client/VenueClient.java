package com.event.booking_service.client;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.event.booking_service.dto.VenueResponse;

@FeignClient(name="venue-service",url="http://localhost:8081")
public interface VenueClient {

    @GetMapping("/venues/{id}")
    VenueResponse getVenue(@PathVariable Long id);
}
