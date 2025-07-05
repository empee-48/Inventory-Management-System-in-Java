package com.inventory.permits.service.dto;

import com.inventory.utils.PermitStatus;

import java.time.LocalDate;

public record BusResponseDto(
        Long id,
        String regNumber,
        String depot,
        LocalDate passengerInsurance,
        LocalDate vehicleInsurance,
        LocalDate vehicleLicence,
        LocalDate certificateOfFitness,
        LocalDate routeAuthority,
        PermitStatus status
) {
}
