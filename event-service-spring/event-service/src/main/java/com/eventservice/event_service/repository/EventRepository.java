package com.eventservice.event_service.repository;

import com.eventservice.event_service.model.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;

public interface EventRepository extends JpaRepository<Event,Long>{

    Optional<Event> findByVenueIdAndDate(Long venueId, LocalDate date);

    List<Event> findByVenueId(Long venueId);
}
