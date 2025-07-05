package com.inventory.inventory.service.dto;

import java.time.LocalDateTime;

public record WithdrawalResponseDto(
        Long id,
        String itemName,
        String unit,
        double amount,
        LocalDateTime createdAt,
        String createBy
) {
}
