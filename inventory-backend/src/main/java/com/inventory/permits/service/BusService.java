package com.inventory.permits.service;

import com.inventory.permits.entity.Bus;
import com.inventory.permits.service.dto.Permits;
import com.inventory.permits.repo.BusRepo;
import com.inventory.permits.service.dto.BusCreateDto;
import com.inventory.permits.service.dto.BusResponseDto;
import com.inventory.utils.PermitStatus;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BusService {
    private final BusRepo repo;

    /**
     *
     * @return List of all bus permits
     */
    public List<Bus> getBuses(){
        return repo.findAll();
    }

    public List<BusResponseDto> getBusesResponse() {
        return getBuses().stream().map(this::busToResponse).toList();
    }

    public Page<BusResponseDto> getBusesPageable(Pageable pageable){
        Page<Bus> busPage = repo.findAll(pageable);
        return busPage.map(this::busToResponse);
    }

    /**
     * Used get method on an optional
     * @param bus
     * @return
     */
    public BusResponseDto busToResponse(Bus bus){
        PermitStatus busStatus = getBusStatus(bus);

        return new BusResponseDto(
                bus.getId(),
                bus.getRegNumber(),
                bus.getDepot(),
                bus.getPassengerInsurance(),
                bus.getVehicleInsurance(),
                bus.getVehicleLicence(),
                bus.getCertificateOfFitness(),
                bus.getRouteAuthority(),
                busStatus
        );
    }

    /**
     * ohhh something terrible happened here
     * @param bus
     * @return optional of permit status
     */
    public PermitStatus getBusStatus(Bus bus) {
        return Arrays.stream(bus.getClass().getDeclaredFields())
                .filter(field -> field.getType().equals(LocalDate.class)) // 1. Find LocalDate fields
                .peek(field -> field.setAccessible(true)) // 2. Enable private field access
                .map(field -> {
                    try {
                        LocalDate date = (LocalDate) field.get(bus);
                        return date != null ? checkDateStatus(date) : PermitStatus.Valid; // 3. Default to Valid if null
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                    return null;
                })
                .max(Comparator.comparing(Enum::ordinal)) // 4. Find the WORST status (highest ordinal)
                .orElse(PermitStatus.Valid); // 5. Default if no dates found
    }

    private PermitStatus checkDateStatus(LocalDate date) {
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            return PermitStatus.Expired;
        } else if (date.isBefore(today.plusMonths(1))) {
            return PermitStatus.AlmostExpired;
        } else {
            return PermitStatus.Valid;
        }
    }

    /**
     * this is an abomination
     * @param id
     * @return
     */
    public Bus getBus(Long id){
        return repo.findById(id).orElseThrow(()->new NoSuchElementException("Vehicle Not Found"));
    }

    public Optional<BusResponseDto> getBusById(Long id){
        return repo.findById(id).map(this::busToResponse);
    }

    public Optional<Bus> getBusByRegNumber(String regNumber){
        return repo.findByRegNumber(regNumber);
    }
    public Optional<BusResponseDto> getBusResponseByRegNumber(String regNumber){
        return getBusByRegNumber(regNumber).map(this::busToResponse);
    }
    public Bus addBus(BusCreateDto dto){
        Bus bus = Bus.builder()
                .regNumber(dto.regNumber().toUpperCase())
                .depot(dto.depot())
                .passengerInsurance(dto.passengerInsurance())
                .vehicleLicence(dto.vehicleLicense())
                .vehicleInsurance(dto.vehicleInsurance())
                .certificateOfFitness(dto.certificateOfFitness())
                .routeAuthority(dto.routeAuthority())
                .build();

        return repo.save(bus);
    }

    /**
     * generate 3 groups of permits, expired, almost expired and then all.
     * @return hashmap containing the different permits
     */
    public HashMap<PermitStatus,List<Permits>> generatePermits(){
        List<Permits> expiredPermits = new ArrayList<>();
        List<Permits> expiringWithinOneMonthPermits = new ArrayList<>();
        List<Permits> validPermits = new ArrayList<>();

        HashMap<PermitStatus,List<Permits>> permitsMap = new HashMap<>();

        List<Bus> buses = repo.findAll();

        buses.forEach(bus -> {
            List<Field> fields = Arrays.stream(bus.getClass().getDeclaredFields())
                    .filter(field -> field.getType().equals(LocalDate.class))
                    .peek(f -> f.setAccessible(true))
                    .toList();

            fields.forEach(field -> {
               try {
                   LocalDate expirationDate = (LocalDate) field.get(bus);

                   Permits permits = Permits.builder()
                           .type(StringUtils.capitalize(field.getName()))
                           .expirationDate(expirationDate)
                           .regNumber(bus.getRegNumber())
                           .depot(bus.getDepot())
                           .build();

                   if(expirationDate.isBefore(LocalDate.now())) expiredPermits.add(permits);

                   else if (expirationDate.isBefore(LocalDate.now().plusMonths(1))) expiringWithinOneMonthPermits.add(permits);

                   else validPermits.add(permits);

                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            });
        });
        permitsMap.put(PermitStatus.Expired,expiredPermits);
        permitsMap.put(PermitStatus.AlmostExpired,expiringWithinOneMonthPermits);
        permitsMap.put(PermitStatus.Valid,validPermits);
        return permitsMap;
    }

    /**
     * changes the date of a permit. something terrible also happened...used get method on an
     * Optional
     * @param permit
     * @throws IllegalAccessException
     */
    public void changePermitDate(Permits permit) throws IllegalAccessException {
        Bus bus = getBusByRegNumber(permit.regNumber()).get();
        Field[] fields = bus.getClass().getDeclaredFields();
        for (Field field : fields) {
            if(field.getName().equalsIgnoreCase(permit.type())){
                field.setAccessible(true);
                field.set(bus,permit.expirationDate());
                field.setAccessible(false);
            }
        }
        repo.save(bus);
    }

    public Bus changeRegNumber(Long id, String regNumber){
        Bus bus = getBus(id);
        bus.setRegNumber(regNumber);

        return repo.save(bus);
    }

    public Bus changeDepot(Long id, String depot){
        Bus bus = getBus(id);
        bus.setDepot(depot);

        return repo.save(bus);
    }

    public boolean deleteBusByRegNumber(String regNumber){
        try{
            Bus bus = repo.findByRegNumber(regNumber).get();
            repo.delete(bus);
            return true;
        } catch (NoSuchElementException e){
            return false;
        }
    }

    public void deleteAll(){
        repo.deleteAll();
    }

    public ByteArrayOutputStream exportPermitsToExcel(List<Permits> permits) throws IOException {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {

            // Create a sheet in the workbook
            Sheet sheet = workbook.createSheet("Bus Permits");

            // Create header style with bold font
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            headerStyle.setAlignment(HorizontalAlignment.CENTER);

            // Create date style
            CellStyle dateStyle = workbook.createCellStyle();
            CreationHelper createHelper = workbook.getCreationHelper();
            dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd-mmm-yyyy"));

            // Create header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {
                    "Registration #",
                    "Depot",
                    "Permit Type",
                    "Expiration Date",
                    "Status",
                    "Days Remaining"
            };

            // Write headers
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Write permit data
            int rowNum = 1;
            for (Permits permit : permits) {
                Row row = sheet.createRow(rowNum++);

                // Registration Number
                row.createCell(0).setCellValue(permit.regNumber());

                // Depot
                row.createCell(1).setCellValue(permit.depot());

                // Permit Type
                row.createCell(2).setCellValue(permit.type());

                // Expiration Date (with formatting)
                Cell dateCell = row.createCell(3);
                if (permit.expirationDate() != null) {
                    dateCell.setCellValue(Date.from(permit.expirationDate()
                            .atStartOfDay(ZoneId.systemDefault()).toInstant()));
                    dateCell.setCellStyle(dateStyle);
                }

                // Status
                String status;
                long daysRemaining = ChronoUnit.DAYS.between(
                        LocalDate.now(),
                        permit.expirationDate()
                );

                if (daysRemaining < 0) {
                    status = "EXPIRED";
                } else if (daysRemaining <= 30) {
                    status = "EXPIRING SOON";
                } else {
                    status = "VALID";
                }

                row.createCell(4).setCellValue(status);

                // Days Remaining (conditional coloring)
                Cell daysCell = row.createCell(5);
                daysCell.setCellValue(daysRemaining);

                CellStyle daysStyle = workbook.createCellStyle();
                if (daysRemaining < 0) {
                    daysStyle.setFillForegroundColor(IndexedColors.RED.getIndex());
                    daysStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                } else if (daysRemaining <= 30) {
                    daysStyle.setFillForegroundColor(IndexedColors.ORANGE.getIndex());
                    daysStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                } else {
                    daysStyle.setFillForegroundColor(IndexedColors.GREEN.getIndex());
                    daysStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                }
                daysCell.setCellStyle(daysStyle);
            }

            // Auto-size all columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            // Freeze header row
            sheet.createFreezePane(0, 1);

            workbook.write(outputStream);
            return outputStream;
        }
    }
    public ByteArrayOutputStream exportBusesToExcel(List<BusResponseDto> buses) throws IOException {
        try (Workbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Bus Permits");

            // Create header row with style
            CellStyle headerStyle = workbook.createCellStyle();
            Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);

            String[] headers = {
                    "Reg Number", "Depot", "Passenger Insurance",
                    "Vehicle License", "Vehicle Insurance",
                    "Certificate Of Fitness", "Route Authority"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
                cell.setCellStyle(headerStyle);
            }

            // Date format
            CellStyle dateStyle = workbook.createCellStyle();
            CreationHelper createHelper = workbook.getCreationHelper();
            dateStyle.setDataFormat(createHelper.createDataFormat().getFormat("dd-mmm-yyyy"));

            // Fill data
            int rowNum = 1;
            for (BusResponseDto bus : buses) {
                Row row = sheet.createRow(rowNum++);

                row.createCell(0).setCellValue(bus.regNumber());
                row.createCell(1).setCellValue(bus.depot());

                // Add dates with formatting
                Cell passengerInsuranceCell = row.createCell(2);
                passengerInsuranceCell.setCellValue(bus.passengerInsurance());
                passengerInsuranceCell.setCellStyle(dateStyle);

                Cell vehicleLicenseCell = row.createCell(3);
                vehicleLicenseCell.setCellValue(bus.vehicleLicence());
                vehicleLicenseCell.setCellStyle(dateStyle);

                Cell vehicleInsuranceCell = row.createCell(4);
                vehicleInsuranceCell.setCellValue(bus.vehicleInsurance());
                vehicleInsuranceCell.setCellStyle(dateStyle);

                Cell fitnessCell = row.createCell(5);
                fitnessCell.setCellValue(bus.certificateOfFitness());
                fitnessCell.setCellStyle(dateStyle);

                Cell routeAuthorityCell = row.createCell(6);
                routeAuthorityCell.setCellValue(bus.routeAuthority());
                routeAuthorityCell.setCellStyle(dateStyle);
            }

            // Auto-size columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return out;
        }
    }
}
