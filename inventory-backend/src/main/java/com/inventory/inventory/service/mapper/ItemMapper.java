package com.inventory.inventory.service.mapper;

import com.inventory.inventory.service.dto.ItemCreateDto;
import com.inventory.inventory.service.dto.ItemResponseDto;
import com.inventory.inventory.entity.Item;
import com.inventory.inventory.repo.ItemRepo;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ItemMapper {
    public ItemRepo item;

    public ItemResponseDto itemToResponse(Item item){
        ItemResponseDto itemResponseDto=new ItemResponseDto(
                item.getId(),
                item.getSerialNumber(),
                item.getName(),
                item.getUnit(),
                item.getInstock(),
                item.getItemTimeStamp().toLocalTime(),
                item.getItemTimeStamp().toLocalDate(),
                item.getCreatedBy()
        );

        return itemResponseDto;
    }

    public Item createToItem(ItemCreateDto dto){
        LocalDateTime now = LocalDateTime.now();
        Item item=new Item();
        item.setUnit(dto.unit());
        item.setName(dto.name());
        item.setSerialNumber(dto.serialNumber());
        item.setInstock(dto.instock());
        item.setItemTimeStamp(now);
        return item;
    }
}
