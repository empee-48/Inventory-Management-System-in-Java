package com.inventory.permits.repo;

import com.inventory.permits.entity.Bus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BusRepo extends JpaRepository<Bus,Long> {
    Page<Bus> findAll(Pageable pageable);

    Optional<Bus> findByRegNumber(String regNumber);
}
