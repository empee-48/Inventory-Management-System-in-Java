package com.inventory.permits.entity;

import com.inventory.inventory.entity.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.OneToOne;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity(name = "tbl_driver")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
public class Driver extends BaseEntity {
    private String driverId;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String depot;

    @Column(unique = true, nullable = false)
    private String phone;

    @OneToOne
    private DriverDoc retest;

    @OneToOne
    private DriverDoc medical;

    @OneToOne
    private DriverDoc defensive;
}
