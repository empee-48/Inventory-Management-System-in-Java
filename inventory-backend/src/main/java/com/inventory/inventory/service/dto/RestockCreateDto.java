package com.inventory.inventory.service.dto;

public record RestockCreateDto(
        Long itemId,
        double amount
) {
}
