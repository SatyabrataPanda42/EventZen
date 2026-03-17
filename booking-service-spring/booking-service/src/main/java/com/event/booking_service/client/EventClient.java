package com.event.booking_service.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import com.event.booking_service.config.FeignConfig;
import com.event.booking_service.dto.EventResponse;

@FeignClient(name="event-service",url="http://localhost:8082",configuration = FeignConfig.class)
public interface EventClient {

    @GetMapping("/events/{id}")
    EventResponse getEvent(@PathVariable Long id);
}
