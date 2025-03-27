package com.inventory.service;

import com.inventory.entity.Item;
import com.inventory.entity.Withdrawal;
import com.inventory.repo.ItemRepo;
import com.inventory.repo.WithdrawalRepo;
import com.inventory.service.dto.WithdrawalCreateDto;
import com.inventory.service.dto.WithdrawalResponseDto;
import com.inventory.service.mapper.WithdrawalMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class WithdrawalService {

    final public WithdrawalRepo withdrawalRepo;
    final private ItemRepo itemRepo;
    final public WithdrawalMapper mapper;

    public WithdrawalService(WithdrawalRepo withdrawalRepo, ItemRepo itemRepo, WithdrawalMapper mapper) {
        this.withdrawalRepo = withdrawalRepo;
        this.itemRepo = itemRepo;
        this.mapper = mapper;
    }

    public Withdrawal createWithdrawal(WithdrawalCreateDto dto){
        Withdrawal withdrawal = mapper.createToWithdrawal(dto);
        Item item = itemRepo.findById(withdrawal.getItem().getId()).orElseThrow(NoSuchElementException::new);

        double availableQuantity = item.getInstock();
        double withdrawalAmount = withdrawal.getAmount();

        if (withdrawalAmount > availableQuantity) {
            throw new IllegalArgumentException("Withdrawal amount exceeds available quantity");
        }

        item.setInstock(availableQuantity - withdrawalAmount);
        itemRepo.save(item);

        LocalDateTime now = LocalDateTime.now();
        withdrawal.setItemTimeStamp(now);
        withdrawalRepo.save(withdrawal);

        return withdrawal;
    }

    public Withdrawal getWithdrawal(Long id){
        return withdrawalRepo.findById(id).orElseThrow(NoSuchElementException::new);
    }

    public void deleteWithdrawal(Long id){
        Withdrawal withdrawal=withdrawalRepo.findById(id).orElseThrow(NoSuchElementException::new);
        Item item = itemRepo.findById(withdrawal.getItem().getId()).orElseThrow(NoSuchElementException::new);
        item.setInstock(item.getInstock() + withdrawal.getAmount());
        itemRepo.save(item);
        withdrawalRepo.delete(withdrawal);
    }

    public List<WithdrawalResponseDto> allWithdrawal(){
        return withdrawalRepo.findAll(Sort.by(Sort.Direction.DESC, "itemTimeStamp")).stream().map(mapper::withdrawalToResponse).toList();
    }

    public List<WithdrawalResponseDto> getWithdrawalByItem(Long id){
        return withdrawalRepo.findWithdrawalsByItemId(id,Sort.by(Sort.Direction.DESC, "itemTimeStamp")).stream().map(mapper::withdrawalToResponse).toList();
    }
}
