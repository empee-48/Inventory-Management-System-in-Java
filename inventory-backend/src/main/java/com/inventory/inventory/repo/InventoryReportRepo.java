package com.inventory.inventory.repo;

import com.inventory.inventory.entity.InventoryReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface InventoryReportRepo extends JpaRepository<InventoryReport,Long> {
}
