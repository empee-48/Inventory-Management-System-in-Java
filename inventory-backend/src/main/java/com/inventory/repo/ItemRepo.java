package com.inventory.repo;

import com.inventory.entity.Item;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ItemRepo extends JpaRepository<Item, Long> {
    List<Item> findItemsByNameIgnoreCase(@Param("name") String name);
}