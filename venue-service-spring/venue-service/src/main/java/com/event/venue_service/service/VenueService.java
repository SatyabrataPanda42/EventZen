package com.event.venue_service.service;

import com.event.venue_service.model.Venue;
import com.event.venue_service.repository.VenueRepository;
import com.event.venue_service.security.ResourceNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VenueService {

    private final VenueRepository repo;

    public VenueService(VenueRepository repo) {
        this.repo = repo;
    }

    public Venue createVenue(Venue venue) {
        return repo.save(venue);
    }

    public List<Venue> getAll() {
        return repo.findAll();
    }

    public Venue getById(Long id) {
        return repo.findById(id).orElse(null);
    }

    public Venue update(Long id, Venue venue, String vendorId) {

    Venue existing = repo.findById(id).orElseThrow();

    if(!existing.getVendorId().equals(vendorId)){
        throw new ResourceNotFoundException("Unauthorized: You cannot edit this venue");
    }

    existing.setName(venue.getName());
    existing.setLocation(venue.getLocation());
    existing.setCapacity(venue.getCapacity());
    existing.setPrice(venue.getPrice());
    existing.setAvailable(venue.isAvailable());

    return repo.save(existing);
}

    public void delete(Long id) {

    Venue venue = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Venue not found"));

    repo.delete(venue);
}
}
