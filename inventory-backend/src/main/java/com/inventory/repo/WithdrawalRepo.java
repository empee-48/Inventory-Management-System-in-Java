package com.inventory.repo;

import com.inventory.entity.Withdrawal;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface WithdrawalRepo extends JpaRepository<Withdrawal,Long> {
    List<Withdrawal> findWithdrawalsByItemId(@Param("itemId") Long itemId, Sort sort);
}
