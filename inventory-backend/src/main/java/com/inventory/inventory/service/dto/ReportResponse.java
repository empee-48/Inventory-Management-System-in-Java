package com.inventory.inventory.service.dto;

import com.inventory.utils.ReportType;

import java.time.LocalDateTime;
import java.util.List;

public record ReportResponse(
        Long id,
        List<ReportItemResponseDto> reportItems,
        LocalDateTime createdAt,
        ReportType reportType
) {
}
