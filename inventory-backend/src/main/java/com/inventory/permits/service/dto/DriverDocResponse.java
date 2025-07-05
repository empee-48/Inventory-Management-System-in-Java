package com.inventory.permits.service.dto;

import com.inventory.utils.DriverDocType;

import java.time.LocalDate;

public record DriverDocResponse(
        String driverId,
        String driverName,
        String depot,
        DriverDocType type,
        LocalDate expirationDate
){
}
