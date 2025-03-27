package com.inventory.service;

import com.inventory.entity.InventoryReport;
import com.inventory.entity.Item;
import com.inventory.entity.ReportItem;
import com.inventory.repo.ReportItemRepo;
import com.inventory.service.dto.ReportItemResponseDto;
import com.inventory.service.dto.RestockResponseDto;
import com.inventory.service.dto.WithdrawalResponseDto;
import com.inventory.service.mapper.ReportItemMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReportItemService {

    final public ReportItemRepo repo;
    final public ReportItemMapper mapper;
    final public RestockService restockService;
    final public WithdrawalService withdrawalService;

    public ReportItemService(ReportItemRepo repo, ReportItemMapper mapper, RestockService restockService, WithdrawalService withdrawalService) {
        this.repo = repo;
        this.mapper = mapper;
        this.restockService = restockService;
        this.withdrawalService = withdrawalService;
    }

    public ReportItem createReportItem(Item item, InventoryReport report){
        ReportItem reportItem=new ReportItem();
        reportItem.setReport(report);
        reportItem.setItem(item);
        reportItem.setClosingStock(item.getInstock());
        reportItem.setOpeningStock(calculateOpeningStock(item));
        return repo.save(reportItem);
    }

    public List<ReportItemResponseDto> allReportItems(){
        return repo.findAll().stream().map(mapper::reportItemToResponse).toList();
    }

    public double calculateOpeningStock(Item item){
        LocalDate now = LocalDateTime.now().toLocalDate();
        double closingStock=item.getInstock();
        List<RestockResponseDto> restocks = restockService.getRestocksByItemId(item.getId());
        List<WithdrawalResponseDto> withdrawals = withdrawalService.getWithdrawalByItem(item.getId());

        for (RestockResponseDto dto:restocks){
            LocalDate dtoDate=dto.createdAt().toLocalDate();
            if(dtoDate.isEqual(now)){
                closingStock-=dto.amount();
            }
        }
        for (WithdrawalResponseDto dto:withdrawals){
            LocalDate dtoDate=dto.createdAt().toLocalDate();
            if(dtoDate.isEqual(now)){
                closingStock+=dto.amount();
            }
        }
        return closingStock;
    }
}
