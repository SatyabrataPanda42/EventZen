package com.event.venue_service.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Venue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String location;

    private int capacity;

    private double price;

    private boolean available;
}