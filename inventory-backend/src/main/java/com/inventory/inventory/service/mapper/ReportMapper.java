package com.inventory.inventory.service.mapper;

import com.inventory.inventory.entity.InventoryReport;
import com.inventory.inventory.repo.InventoryReportRepo;
import com.inventory.inventory.service.ReportItemService;
import com.inventory.inventory.service.dto.ReportResponse;
import org.springframework.stereotype.Service;

@Service
public class ReportMapper {
    final private InventoryReportRepo repo;
    final private ReportItemService service;
    final private ReportItemMapper itemMapper;
    public ReportMapper(InventoryReportRepo repo, ReportItemService service, ReportItemMapper itemMapper) {
        this.repo = repo;
        this.service = service;
        this.itemMapper = itemMapper;
    }

    public ReportResponse reportToResponse(InventoryReport report){
        ReportResponse response=new ReportResponse(
                report.getId(),
                report.getItems().stream().map(itemMapper::reportItemToResponse).toList(),
                report.getItemTimeStamp(),
                report.getReportType()
        );
        return response;
    }
}
