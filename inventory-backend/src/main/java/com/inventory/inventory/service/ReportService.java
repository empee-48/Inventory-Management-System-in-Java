package com.inventory.inventory.service;

import com.inventory.inventory.entity.InventoryReport;
import com.inventory.inventory.entity.Item;
import com.inventory.inventory.entity.ReportItem;
import com.inventory.inventory.repo.InventoryReportRepo;
import com.inventory.inventory.service.dto.ReportResponse;
import com.inventory.inventory.service.mapper.ReportMapper;
import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.poi.hssf.usermodel.HSSFRow;
import org.apache.poi.hssf.usermodel.HSSFSheet;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ReportService {
    final private InventoryReportRepo repo;
    final private ItemService itemService;
    final private ReportItemService reportItemService;
    final private ReportMapper mapper;

    public ReportService(InventoryReportRepo repo, ItemService itemService, ReportItemService reportItemService, ReportMapper mapper) {
        this.repo = repo;
        this.itemService = itemService;
        this.reportItemService = reportItemService;
        this.mapper = mapper;
    }

    public List<ReportResponse> allReports(){
        return repo.findAll(Sort.by(Sort.Direction.DESC, "itemTimeStamp")).stream().map(mapper::reportToResponse).toList();
    }

    public InventoryReport createReport(){
        InventoryReport report=new InventoryReport();
        LocalDateTime now=LocalDateTime.now();
        report.setItemTimeStamp(now);
        repo.save(report);
        List<Item> items = itemService.specialItems();
        List<ReportItem> reportItems=items.stream().map(item->{
            return reportItemService.createReportItem(item,report);
        }).toList();
        return repo.save(report);
    }

    public ReportResponse inventoryById(Long id){
        return mapper.reportToResponse(repo.findById(id).orElseThrow(NoSuchElementException::new));
    }

    public void generateExcel(HttpServletResponse response, Long id) throws Exception{
        InventoryReport report=repo.findById(id).orElseThrow(NoSuchElementException::new);
        List<ReportItem> reportItems=report.getItems();

        HSSFWorkbook workbook=new HSSFWorkbook();
        HSSFSheet worksheet=workbook.createSheet(report.getReportType()+"_Inventory_Report_"+report.getItemTimeStamp());
        HSSFRow row=worksheet.createRow(0);

        row.createCell(0).setCellValue("Item Name");
        row.createCell(1).setCellValue("Opening Stock");
        row.createCell(2).setCellValue("Closing Stock");

        int rowIndex=1;

        for(ReportItem item:reportItems){
            HSSFRow dataRow=worksheet.createRow(rowIndex);
            dataRow.createCell(0).setCellValue(item.getItem().getName());
            dataRow.createCell(1).setCellValue(item.getOpeningStock());
            dataRow.createCell(2).setCellValue(item.getClosingStock());
            rowIndex++;
        }

        ServletOutputStream ops=response.getOutputStream();
        workbook.write(ops);
        workbook.close();
        ops.close();
    }

}
