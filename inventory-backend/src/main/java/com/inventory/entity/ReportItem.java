package com.inventory.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "report_items")
public class ReportItem extends BaseEntity{

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "item_id")
    private Item item;

    @ManyToOne
    @JsonBackReference
    private InventoryReport report;

    private double openingStock;
    private double closingStock;
}
