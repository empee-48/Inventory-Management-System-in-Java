package com.inventory.inventory.service.dto;

import org.springframework.stereotype.Service;

public record ReportItemCreateDto(
        Long itemId,
        double openingStock,
        double closingStock
) {

}
