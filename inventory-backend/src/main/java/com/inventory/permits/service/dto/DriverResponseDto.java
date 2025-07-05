package com.inventory.permits.service.dto;

import com.inventory.utils.PermitStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record DriverResponseDto (
        String id,
        String firstName,
        String lastName,
        String phone,
        String depot,
        LocalDate retest,
        LocalDate medical,
        LocalDate defensive,
        PermitStatus status
){
}
