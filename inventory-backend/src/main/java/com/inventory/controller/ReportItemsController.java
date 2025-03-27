package com.inventory.controller;

import com.inventory.service.ReportItemService;
import com.inventory.service.dto.ReportItemResponseDto;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("inventory/api/reportitems")
@CrossOrigin
public class ReportItemsController {
    final private ReportItemService service;

    public ReportItemsController(ReportItemService service) {
        this.service = service;
    }

    @GetMapping
    public List<ReportItemResponseDto> allReportItems(){
        return service.allReportItems();
    }
}
