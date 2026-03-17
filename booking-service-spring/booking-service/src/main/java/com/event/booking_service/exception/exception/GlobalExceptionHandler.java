package com.event.booking_service.exception.exception;


import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<?> notFound(ResourceNotFoundException ex){

        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error",ex.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<?> unauthorized(UnauthorizedException ex){

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(Map.of("error",ex.getMessage()));
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> venueError(BadRequestException ex){

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error",ex.getMessage()));
    }
}
