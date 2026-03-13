package com.event.venue_service.service;

import com.event.venue_service.model.Venue;
import com.event.venue_service.repository.VenueRepository;
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

    public Venue update(Long id, Venue venue) {

        Venue existing = repo.findById(id).orElseThrow();

        existing.setName(venue.getName());
        existing.setLocation(venue.getLocation());
        existing.setCapacity(venue.getCapacity());
        existing.setPrice(venue.getPrice());
        existing.setAvailable(venue.isAvailable());

        return repo.save(existing);
    }

    public void delete(Long id) {
        repo.deleteById(id);
    }
}
