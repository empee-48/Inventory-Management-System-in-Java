package com.inventory.inventory.repo;

import com.inventory.inventory.entity.Restock;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RestockRepo extends JpaRepository<Restock,Long> {
    List<Restock> findRestocksByItemId(@Param("ItemId") Long id, Sort sort);
}
