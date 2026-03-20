package com.event.venue_service.service;

import com.event.venue_service.client.EventClient;
import com.event.venue_service.model.Venue;
import com.event.venue_service.repository.VenueRepository;
import com.event.venue_service.security.ResourceNotFoundException;
import com.event.venue_service.security.UnauthorizedException;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository repo;
    private final EventClient eventClient;

    public VenueService(VenueRepository repo, EventClient eventClient) {
        this.repo = repo;
        this.eventClient = eventClient;
    }

    public Venue createVenue(Venue venue) {
        return repo.save(venue);
    }

    public List<Venue> getAll() {
        return repo.findAll();
    }

    public Venue getById(Long id) {

        return repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));
    }

    public Venue update(Long id, Venue venue, String userId, Authentication auth) {

        Venue existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Venue not found"));

        boolean isAdmin = auth.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("admin"));

        if (!isAdmin && !existing.getVendorId().equals(userId)) {
            throw new UnauthorizedException("You cannot update this venue");
        }

        existing.setName(venue.getName());
        existing.setLocation(venue.getLocation());
        existing.setCapacity(venue.getCapacity());
        existing.setPrice(venue.getPrice());

        return repo.save(existing);
    }

    public void delete(Long id, String role, String userId) {

        Venue venue = repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));

        if (role.equals("customer")) {
            throw new UnauthorizedException("Not allowed");
        }

        if (role.equals("vendor") && !venue.getVendorId().equals(userId)) {
            throw new UnauthorizedException("You can't delete this venue");
        }

        try {
            // 🔥 STEP 1: DELETE EVENTS (CASCADE)
            eventClient.deleteEventsByVenue(id);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete related events");
        }

        // 🔥 STEP 2: DELETE VENUE
        repo.deleteById(id);
    }

    public List<Venue> getVendorVenues(String vendorId) {

        return repo.findByVendorId(vendorId);

    }
}
