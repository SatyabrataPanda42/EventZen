package com.event.booking_service.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.event.booking_service.client.VenueClient;
import com.event.booking_service.dto.AttendeeRequest;
import com.event.booking_service.dto.VenueResponse;
import com.event.booking_service.exception.exception.BadRequestException;
import com.event.booking_service.exception.exception.ResourceNotFoundException;
import com.event.booking_service.exception.exception.UnauthorizedException;
import com.event.booking_service.model.Attendee;
import com.event.booking_service.model.Booking;
import com.event.booking_service.repository.AttendeeRepository;
import com.event.booking_service.repository.BookingRepository;

@Service
public class AttendeeService {

    private final AttendeeRepository repo;
    private final BookingRepository bookingRepo;
    private final VenueClient venueClient;

    public AttendeeService(
            AttendeeRepository repo,
            BookingRepository bookingRepo,
            VenueClient venueClient){

        this.repo=repo;
        this.bookingRepo=bookingRepo;
        this.venueClient=venueClient;
    }

    public Attendee add(AttendeeRequest req,String userId){

        Booking booking=bookingRepo.findById(req.getBookingId())
                .orElseThrow(() ->
                        new ResourceNotFoundException("Booking not found"));

        if(!booking.getUserId().equals(userId)){

            throw new UnauthorizedException(
                    "You can add attendees only to your booking");
        }

        VenueResponse venue=venueClient.getVenue(booking.getVenueId());

        long attendeeCount=
                repo.countByBookingId(req.getBookingId());

        if(attendeeCount >= venue.getCapacity()){

            throw new BadRequestException(
                    "Attendee limit reached");
        }

        Attendee attendee=new Attendee();

        attendee.setBookingId(req.getBookingId());
        attendee.setUserId(userId);
        attendee.setName(req.getName());
        attendee.setEmail(req.getEmail());

        return repo.save(attendee);
    }
public void delete(Long id, String userId, String role){

    Attendee attendee = repo.findById(id)
            .orElseThrow(() ->
                    new ResourceNotFoundException("Attendee not found"));

    // ❌ Only block if NOT admin AND not owner
    if(!"admin".equals(role) && !attendee.getUserId().equals(userId)){
        throw new UnauthorizedException(
                "You can delete only your attendee");
    }

    repo.delete(attendee);
}
    public List<Attendee> getAttendeesByEvent(Long eventId,String userId){

    Booking booking = bookingRepo.findByEventIdAndUserId(eventId,userId);

    if(booking == null){
        throw new ResourceNotFoundException("No booking found for this event");
    }

    List<Attendee> attendees = repo.findByBookingId(booking.getId());

    if(attendees.isEmpty()){
        throw new ResourceNotFoundException("No attendees found");
    }

    return attendees;
}
public List<Attendee> getAllAttendees() {
    return repo.findAll(); 
}
}