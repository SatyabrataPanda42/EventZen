package com.eventservice.event_service.exception;

public class VenueUnavailableException extends RuntimeException{
    public VenueUnavailableException(String message){
        super(message);
    }
}
