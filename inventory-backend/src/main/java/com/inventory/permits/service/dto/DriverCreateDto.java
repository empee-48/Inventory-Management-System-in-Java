package com.inventory.permits.service.dto;

import java.time.LocalDate;

public record DriverCreateDto(
        String firstName,
        String lastName,
        String phone,
        String depot,
        LocalDate retest,
        LocalDate medical,
        LocalDate defensive
) {
}
