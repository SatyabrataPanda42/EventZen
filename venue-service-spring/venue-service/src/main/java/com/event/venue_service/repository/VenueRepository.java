package com.event.venue_service.repository;

import com.event.venue_service.model.Venue;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

public interface VenueRepository extends JpaRepository<Venue, Long> {
    List<Venue> findByVendorId(String vendorId);
}
