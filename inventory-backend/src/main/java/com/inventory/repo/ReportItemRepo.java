package com.inventory.repo;

import com.inventory.entity.ReportItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportItemRepo extends JpaRepository<ReportItem,Long> {
}
