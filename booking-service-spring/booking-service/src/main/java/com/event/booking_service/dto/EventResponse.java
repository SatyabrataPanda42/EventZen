package com.event.booking_service.dto;

import lombok.Data;

@Data
public class EventResponse {
    private Long id;
    private Long venueId;
    private String name;
    private String vendorId;
}
