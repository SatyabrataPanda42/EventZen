package com.eventservice.event_service.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EventRequest {

    private String name;
    private String description;
    private LocalDate date;
    private Long venueId;
}
