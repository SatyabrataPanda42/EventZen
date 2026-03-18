package com.event.venue_service.controller;

import com.event.venue_service.model.Venue;
import com.event.venue_service.security.UnauthorizedException;
import com.event.venue_service.service.VenueService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/venues")
public class VenueController {

    private final VenueService service;

    public VenueController(VenueService service) {
        this.service = service;
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('admin','vendor')")
    public Venue createVenue(@RequestBody Venue venue, Authentication auth) {

        String vendorId = auth.getName(); 
        venue.setVendorId(vendorId);

        return service.createVenue(venue);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('admin','vendor')")
    public Venue updateVenue(@PathVariable Long id,
                             @RequestBody Venue venue,
                             Authentication auth) {

        String vendorId = auth.getName();

        return service.update(id, venue, vendorId);
    }
@DeleteMapping("/{id}")
@PreAuthorize("hasAnyAuthority('admin','vendor')")
public ResponseEntity<?> deleteVenue(@PathVariable Long id,
                                     Authentication auth) {

    String userId = auth.getName();

    Venue venue = service.getById(id);

    if (!auth.getAuthorities().stream()
            .anyMatch(a -> a.getAuthority().equals("admin"))) {

        if (!venue.getVendorId().equals(userId)) {
            throw new UnauthorizedException("You cannot delete this venue");
        }
    }

    service.delete(id);

    return ResponseEntity.ok(Map.of("message", "Venue deleted successfully"));
}

    @GetMapping
@PreAuthorize("hasAnyAuthority('admin','vendor','customer')")
public List<Venue> getAllVenues(Authentication auth) {

    String role = auth.getAuthorities().iterator().next().getAuthority();
    String userId = auth.getName();

    if (role.equals("vendor")) {
        // Vendor → only own venues
        return service.getVendorVenues(userId);
    }

    // Admin & Customer → all venues
    return service.getAll();
}

    @GetMapping("/{id}")
    public Venue getVenue(@PathVariable Long id) {
        return service.getById(id);
    }

    @GetMapping("/{id}/availability")
    public boolean checkAvailability(@PathVariable Long id) {

        Venue venue = service.getById(id);

        if (venue == null) return false;

        return venue.isAvailable();
    }
    @GetMapping("/my")
@PreAuthorize("hasAuthority('vendor')")
public List<Venue> getVendorVenues(Authentication auth){

    String vendorId = auth.getName();

    return service.getVendorVenues(vendorId);

}
}