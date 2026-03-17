package com.event.booking_service.dto;

import lombok.Data;

@Data
public class AttendeeRequest {

    private Long bookingId;

    private String name;

    private String email;
}
