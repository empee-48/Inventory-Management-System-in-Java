package com.inventory.inventory.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.inventory.utils.ReportType;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.List;

@Data
@EqualsAndHashCode(callSuper = true)
@Entity
@Table(name = "inventory_report")
public class InventoryReport extends BaseEntity{

    @OneToMany(mappedBy = "report",cascade = CascadeType.ALL,orphanRemoval = true)
    @JsonBackReference
    private List<ReportItem> items;

    private ReportType reportType;

}
