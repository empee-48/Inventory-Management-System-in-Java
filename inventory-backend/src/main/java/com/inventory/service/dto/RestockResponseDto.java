package com.inventory.service.dto;

import java.time.LocalDateTime;

public record RestockResponseDto(
        Long id,
        String itemName,
        String unit,
        double amount,
        LocalDateTime createdAt,
        String createBy
) {
}
