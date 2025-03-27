package com.inventory.service.dto;

public record WithdrawalCreateDto(
        Long itemId,
        double amount
) {
}
