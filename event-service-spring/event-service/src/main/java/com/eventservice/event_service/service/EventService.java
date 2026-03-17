package com.eventservice.event_service.service;



import com.eventservice.event_service.client.VenueClient;
import com.eventservice.event_service.dto.VenueResponse;
import com.eventservice.event_service.exception.*;
import com.eventservice.event_service.model.Event;
import com.eventservice.event_service.repository.EventRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EventService {

    private final EventRepository repo;
    private final VenueClient venueClient;

    public EventService(EventRepository repo,VenueClient venueClient){
        this.repo=repo;
        this.venueClient=venueClient;
    }

    public Event create(Event event,String role,String userId){

    if(role.equals("customer"))
        throw new UnauthorizedException("You are not authorized to access this");

    VenueResponse venue;

    try{

    venue = venueClient.getVenue(event.getVenueId());

    System.out.println("VENUE FOUND: " + venue.getId());

}
catch(Exception e){

    e.printStackTrace();

    throw new VenueUnavailableException("Venue not available");
}

    if(role.equals("vendor") && !venue.getVendorId().equals(userId)){
        throw new UnauthorizedException("You can't create events for another vendor's venue");
    }

    event.setCreatedBy(userId);

    return repo.save(event);
}

    public List<Event> getAll(){
        return repo.findAll();
    }

    public List<Event> getByVenue(Long venueId){
        return repo.findByVenueId(venueId);
    }
        public Event getById(Long id){

    return repo.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Event not found"));
}
    public Event update(Long id,Event event,String role,String userId){

        Event existing=repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if(role.equals("customer"))
            throw new UnauthorizedException("You are not authorized to access this");

        if(role.equals("vendor") && !existing.getCreatedBy().equals(userId)){
    throw new UnauthorizedException("You can't modify events of another venue");
}

        existing.setName(event.getName());
        existing.setDescription(event.getDescription());
        existing.setDate(event.getDate());

        return repo.save(existing);
    }

    public void delete(Long id,String role,String userId){
        Event existing=repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));
        Event event=repo.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found"));

        if(role.equals("customer"))
            throw new UnauthorizedException("You are not authorized to access this");

        if(role.equals("vendor") && !existing.getCreatedBy().equals(userId)){
    throw new UnauthorizedException("You can't modify events of another venue");
}
        repo.delete(event);
    }

}