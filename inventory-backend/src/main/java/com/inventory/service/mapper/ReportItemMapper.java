package com.inventory.service.mapper;

import com.inventory.entity.Item;
import com.inventory.entity.ReportItem;
import com.inventory.repo.ItemRepo;
import com.inventory.service.dto.ReportItemCreateDto;
import com.inventory.service.dto.ReportItemResponseDto;
import org.springframework.stereotype.Service;

@Service
public class ReportItemMapper {
    final public ItemRepo itemRepo;

    public ReportItemMapper(ItemRepo itemRepo) {
        this.itemRepo = itemRepo;
    }

    public ReportItem createToReportItem(ReportItemCreateDto dto){
        Item item = itemRepo.findById(dto.itemId()).get();
        ReportItem reportItem = new ReportItem();
        reportItem.setItem(item);
        reportItem.setOpeningStock(dto.openingStock());
        reportItem.setClosingStock(dto.closingStock());

        return reportItem;
    }

    public ReportItemResponseDto reportItemToResponse(ReportItem item){
        ReportItemResponseDto dto= new ReportItemResponseDto(
                item.getId(),
                item.getItem().getSerialNumber(),
                item.getItem().getName(),
                item.getOpeningStock(),
                item.getClosingStock(),
                item.getItem().getUnit()
        );
        return dto;
    }
}
