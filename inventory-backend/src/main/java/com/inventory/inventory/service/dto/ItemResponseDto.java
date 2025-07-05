package com.inventory.inventory.service.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record ItemResponseDto(
        Long id,
        String serial_number,
        String name,
        String unit,
        double instock,
        LocalTime timeCreated,
        LocalDate dateCreated,
        String createdBy
) {
}
