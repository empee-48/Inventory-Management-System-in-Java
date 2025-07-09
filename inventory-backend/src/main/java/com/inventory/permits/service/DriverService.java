package com.inventory.permits.service;

import com.inventory.permits.entity.Driver;
import com.inventory.permits.service.dto.DriverDocResponse;
import com.inventory.permits.repo.DriverRepo;
import com.inventory.permits.service.dto.DriverCreateDto;
import com.inventory.permits.service.dto.DriverResponseDto;
import com.inventory.utils.DriverDocType;
import com.inventory.utils.PermitStatus;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DriverService {
    private final DriverMapper mapper;
    private final DriverRepo repo;

    public List<DriverResponseDto> getDrivers(){
        return repo.findAll().stream().map(mapper::driverToResponse).toList();
    }

    public Optional<DriverResponseDto> getDriver(Long id){
        return repo.findById(id).map(mapper::driverToResponse);
    }

    public Driver createDriver(DriverCreateDto dto){
        Driver driver = repo.save(mapper.createToDriver(dto));
        String generatedCode = String.format("DR%d", 1000+ driver.getId());
        driver.setDriverId(generatedCode);
        return repo.save(driver);
    }

    public boolean deleteDriver(String id){
        try{
            Driver driver = repo.findByDriverId(id).get();
            repo.delete(driver);
            return true;
        }
        catch (NoSuchElementException e){
            return false;
        }
    }

    public void deleteAll(){
        repo.deleteAll();
    }

    /**
     * creates new hashmap with 3 lists of driver doc responses
     * iterates through each driver and adds it to the appropriate list using
     * the getDocStatus function
     * @return generated hashmap
     */
    public HashMap<PermitStatus, List<DriverDocResponse>> getDriverDocs(){
        HashMap<PermitStatus, List<DriverDocResponse>> hashMap = new HashMap<>();
        hashMap.put(PermitStatus.Valid, new ArrayList<>());
        hashMap.put(PermitStatus.AlmostExpired, new ArrayList<>());
        hashMap.put(PermitStatus.Expired, new ArrayList<>());

        List<Driver> drivers = repo.findAll();
        drivers.forEach(driver -> {
            hashMap.get(mapper.getDocStatus(driver.getMedical())).add(mapper.driverDocToResponse(driver.getMedical(),driver));
            hashMap.get(mapper.getDocStatus(driver.getRetest())).add(mapper.driverDocToResponse(driver.getRetest(),driver));
            hashMap.get(mapper.getDocStatus(driver.getDefensive())).add(mapper.driverDocToResponse(driver.getDefensive(),driver));
        });
        return hashMap;
    }

    public Optional<DriverResponseDto> getDriverByDriverId(String driverId) {
        return repo.findByDriverId(driverId).map(mapper::driverToResponse);
    }

    public Driver updateDriverDoc(DriverDocResponse doc){
        Driver driver = repo.findByDriverId(doc.driverId()).get();
        switch (doc.type()){
            case DriverDocType.Medical: driver.getMedical().setExpirationDate(doc.expirationDate());
            case DriverDocType.Retest: driver.getRetest().setExpirationDate(doc.expirationDate());
            case DriverDocType.Defensive: driver.getDefensive().setExpirationDate(doc.expirationDate());
        }
        return repo.save(driver);
    }
    public ByteArrayOutputStream exportToExcel(List<DriverDocResponse> docs) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Driver Documents");

            // Create header row
            Row headerRow = sheet.createRow(0);
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            // Create headers
            String[] headers = {"Driver ID", "Driver Name", "Depot", "Document Type", "Expiration Date"};
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Fill data
            int rowNum = 1;
            for (DriverDocResponse doc : docs) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(doc.driverId());
                row.createCell(1).setCellValue(doc.driverName());
                row.createCell(2).setCellValue(doc.depot());
                row.createCell(3).setCellValue(doc.type().toString());

                // Format date properly
                Cell dateCell = row.createCell(4);
                if (doc.expirationDate() != null) {
                    dateCell.setCellValue(doc.expirationDate());

                    // Correct date format
                    CellStyle dateStyle = workbook.createCellStyle();
                    dateStyle.setDataFormat(workbook.getCreationHelper().createDataFormat().getFormat("dd-MM-yyyy"));
                    dateCell.setCellStyle(dateStyle);
                }
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(outputStream);
            return outputStream;
        }
    }
    public ByteArrayOutputStream exportDriversToExcel(List<DriverResponseDto> drivers) throws IOException {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Drivers");

            // Create header row
            Row headerRow = sheet.createRow(0);
            headerRow.createCell(0).setCellValue("Driver ID");
            headerRow.createCell(1).setCellValue("Name");
            headerRow.createCell(2).setCellValue("Phone");
            headerRow.createCell(3).setCellValue("Depot");
            headerRow.createCell(4).setCellValue("Medical");
            headerRow.createCell(5).setCellValue("Retest");
            headerRow.createCell(6).setCellValue("Defensive");

            // Fill data
            int rowNum = 1;
            for (DriverResponseDto driver : drivers) {
                Row row = sheet.createRow(rowNum++);
                row.createCell(0).setCellValue(driver.id());
                row.createCell(1).setCellValue(driver.firstName() + " " + driver.lastName());
                row.createCell(2).setCellValue(driver.phone());
                row.createCell(3).setCellValue(driver.depot());
                row.createCell(4).setCellValue(driver.medical().toString());
                row.createCell(5).setCellValue(driver.retest().toString());
                row.createCell(6).setCellValue(driver.defensive().toString());
            }

            // Auto-size columns
            for (int i = 0; i < 7; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out;
        }
    }
}
