package com.inventory.inventory.service.dto;

public record ItemCreateDto(
        String serialNumber,
        String name,
        String unit,
        double instock
) {
}
