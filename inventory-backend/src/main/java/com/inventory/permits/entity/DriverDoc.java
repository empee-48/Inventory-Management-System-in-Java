package com.inventory.permits.entity;

import com.inventory.inventory.entity.BaseEntity;
import com.inventory.utils.DriverDocType;
import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Data
@Entity
@EqualsAndHashCode(callSuper = true)
public class DriverDoc extends BaseEntity {
    private DriverDocType docType;
    private LocalDate expirationDate;
}
