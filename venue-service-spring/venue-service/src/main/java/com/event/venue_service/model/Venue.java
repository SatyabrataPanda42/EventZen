package com.event.venue_service.model;

import java.time.LocalDateTime;

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

    @Column(name = "vendor_id")
    private String vendorId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    public void setCreationTime() {
        this.createdAt = LocalDateTime.now();
    }
}