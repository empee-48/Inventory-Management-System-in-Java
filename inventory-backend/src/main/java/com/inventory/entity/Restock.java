package com.inventory.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "restock")
public class Restock extends BaseEntity{

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "item_id")
    private Item item;

    @Min(value = 0,message = "Restock items can not have a value less than zero")
    private double amount;
}
