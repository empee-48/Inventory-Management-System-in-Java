package com.inventory.permits.repo;

import com.inventory.permits.entity.DriverDoc;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DriverDocRepo extends JpaRepository<DriverDoc, Long> {
}
