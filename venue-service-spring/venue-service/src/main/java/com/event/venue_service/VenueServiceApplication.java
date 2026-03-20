package com.event.venue_service;

import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@EnableFeignClients(basePackages = "com.event.venue_service.client")
@SpringBootApplication
public class VenueServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(VenueServiceApplication.class, args);
		System.out.println("Venue service is Running");
	}

}
