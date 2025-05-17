package com.inventory.permits.entity;


import com.inventory.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;

@Data
@EqualsAndHashCode(callSuper = false)
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
@Entity(name = "tblbus")
public class Bus extends BaseEntity {
    @Column(nullable = false, unique = true)
    private String regNumber;

    @Column(nullable = false, unique = true)
    private String depot;

    private LocalDate passengerInsurance;
    private LocalDate vehicleInsurance;
    private LocalDate vehicleLicence;
    private LocalDate certificateOfFitness;
    private LocalDate routeAuthority;

}
