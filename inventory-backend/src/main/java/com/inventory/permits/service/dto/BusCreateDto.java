package com.inventory.permits.service.dto;

import java.time.LocalDate;

public record BusCreateDto(
    String regNumber,
    String depot,
    LocalDate passengerInsurance,
    LocalDate vehicleLicense,
    LocalDate vehicleInsurance,
    LocalDate certificateOfFitness,
    LocalDate routeAuthority
) {
}
