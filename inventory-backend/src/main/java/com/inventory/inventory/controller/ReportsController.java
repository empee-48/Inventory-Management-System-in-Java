package com.inventory.inventory.controller;

import com.inventory.inventory.entity.InventoryReport;
import com.inventory.inventory.service.ReportService;
import com.inventory.inventory.service.dto.ReportResponse;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("inventory/api/reports")
@CrossOrigin
public class ReportsController {
    final private ReportService service;

    public ReportsController(ReportService service) {
        this.service = service;
    }

    @GetMapping
    public List<ReportResponse> allReports(){
        return service.allReports();
    }

    @GetMapping("/{id}")
    public ReportResponse getInventoryReport(@PathVariable Long id){
        return service.inventoryById(id);
    }

    @GetMapping("/{id}/download")
    public void downloadExcel(HttpServletResponse response, @PathVariable Long id) throws Exception {
        response.setContentType("application/octet-stream");
        String headerKey="Content-Disposition";
        String headerValue="attachment;filename=Inventory_Report.xls";
        response.setHeader(headerKey,headerValue);
        service.generateExcel(response,id);
    }

    @PostMapping
    public InventoryReport createInventoryReport(){
        return service.createReport();
    }
}
