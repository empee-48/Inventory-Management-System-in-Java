package com.inventory.inventory.service.mapper;

import com.inventory.inventory.entity.Item;
import com.inventory.inventory.entity.Withdrawal;
import com.inventory.inventory.repo.ItemRepo;
import com.inventory.inventory.service.dto.WithdrawalCreateDto;
import com.inventory.inventory.service.dto.WithdrawalResponseDto;
import org.springframework.stereotype.Service;

@Service
public class WithdrawalMapper {

    final public ItemRepo itemRepo;

    public WithdrawalMapper(ItemRepo itemRepo) {
        this.itemRepo = itemRepo;
    }

    public Withdrawal createToWithdrawal(WithdrawalCreateDto dto){
        Item item=itemRepo.findById(dto.itemId()).get();
        Withdrawal withdrawal=new Withdrawal();
        withdrawal.setAmount(dto.amount());
        withdrawal.setItem(item);

        return withdrawal;
    }

    public WithdrawalResponseDto withdrawalToResponse(Withdrawal withdrawal){
        WithdrawalResponseDto dto=new WithdrawalResponseDto(
                withdrawal.getId(),
                withdrawal.getItem().getName(),
                withdrawal.getItem().getUnit(),
                withdrawal.getAmount(),
                withdrawal.getItemTimeStamp(),
                withdrawal.getCreatedBy()
        );
        return dto;
    }
}
