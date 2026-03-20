package com.eventservice.event_service.client;

import com.eventservice.event_service.dto.VenueResponse;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.*;
import com.eventservice.event_service.config.FeignConfig;

@FeignClient(name = "venue-service", url = "http://localhost:8081", configuration = FeignConfig.class)
public interface VenueClient {

    @GetMapping("/venues/{id}")
    VenueResponse getVenue(@PathVariable("id") Long id);

}