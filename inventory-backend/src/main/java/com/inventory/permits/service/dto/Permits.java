package com.inventory.permits.service.dto;

import lombok.Builder;
import java.time.LocalDate;

@Builder
public record Permits(
        String regNumber,
        String type,
        LocalDate expirationDate,
        String depot
) {}
