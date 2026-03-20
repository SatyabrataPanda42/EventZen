package com.event.venue_service;

import com.event.venue_service.controller.VenueController;
import com.event.venue_service.model.Venue;
import com.event.venue_service.service.VenueService;
import com.fasterxml.jackson.databind.ObjectMapper;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.ArgumentMatchers.any;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(VenueController.class)
class VenueControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private VenueService service;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @WithMockUser(username = "vendor1", authorities = {"vendor"})
    void createVenue_success() throws Exception {

        Venue venue = new Venue();
        venue.setName("Test Venue");

        when(service.createVenue(any())).thenReturn(venue);

        mockMvc.perform(post("/venues")
                .contentType("application/json")
                .content(objectMapper.writeValueAsString(venue)))
                .andExpect(status().isOk());

        verify(service).createVenue(any());
    }
}