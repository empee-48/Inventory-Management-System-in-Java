package com.inventory.permits.repo;

import com.inventory.permits.entity.Driver;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DriverRepo extends JpaRepository<Driver, Long> {
    Optional<Driver> findByDriverId(String driverId);
}
