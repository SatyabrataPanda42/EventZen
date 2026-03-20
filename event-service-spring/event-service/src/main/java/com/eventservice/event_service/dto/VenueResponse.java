package com.eventservice.event_service.dto;

import lombok.Data;

@Data
public class VenueResponse {
    private boolean available;
    private int capacity;
    private Long id;
    private String location;
    private String name;
    private double price;
    private String vendorId;

}