package com.inventory.permits.entity;

import lombok.Builder;
import java.time.LocalDate;

@Builder
public record Permits(
        String regNumber,
        String permitType,
        LocalDate expirationDate
) {}
