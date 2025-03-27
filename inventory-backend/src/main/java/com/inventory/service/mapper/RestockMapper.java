package com.inventory.service.mapper;

import com.inventory.entity.Item;
import com.inventory.entity.Restock;
import com.inventory.repo.ItemRepo;
import com.inventory.service.dto.RestockCreateDto;
import com.inventory.service.dto.RestockResponseDto;
import org.springframework.stereotype.Service;

@Service
public class RestockMapper {

    final public ItemRepo itemRepo;

    public RestockMapper(ItemRepo itemRepo) {
        this.itemRepo = itemRepo;
    }

    public Restock createToRestock(RestockCreateDto dto){
        Item item=itemRepo.findById(dto.itemId()).get();
        Restock restock=new Restock();
        restock.setAmount(dto.amount());
        restock.setItem(item);

        return restock;
    }

    public RestockResponseDto restockToResponse(Restock restock){
        RestockResponseDto dto=new RestockResponseDto(
                restock.getId(),
                restock.getItem().getName(),
                restock.getItem().getUnit(),
                restock.getAmount(),
                restock.getItemTimeStamp(),
                restock.getCreatedBy()
        );
        return dto;
    }
}
