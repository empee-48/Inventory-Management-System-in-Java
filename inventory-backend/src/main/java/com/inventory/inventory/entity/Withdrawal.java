package com.inventory.inventory.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@EqualsAndHashCode(callSuper = false)
@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "withdrawals")
public class Withdrawal extends BaseEntity{

    @ManyToOne
    @JsonBackReference
    private Item item;

    @Min(value = 0,message = "Withdrawal value for items cannot be less than zero")
    private double amount;
}
