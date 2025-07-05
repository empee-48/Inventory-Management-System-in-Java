package com.inventory.inventory.service.dto;

public record ReportItemResponseDto(
        Long id,
        String itemSerialNumber,
        String itemName,
        double openingStock,
        double closingStock,
        String unit
) {
}
