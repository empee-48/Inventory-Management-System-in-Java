package com.inventory.permits.controller;

import com.inventory.permits.entity.Bus;
import com.inventory.permits.service.dto.DriverDocResponse;
import com.inventory.permits.service.dto.Permits;
import com.inventory.permits.service.BusService;
import com.inventory.permits.service.dto.BusCreateDto;
import com.inventory.permits.service.dto.BusResponseDto;
import com.inventory.utils.PermitStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/inventory/api/buses")
@RequiredArgsConstructor
public class BusController {
    private final BusService service;

    @GetMapping
    public ResponseEntity<?> getAll(
            @RequestParam(defaultValue = "") String depot,
            @RequestParam(defaultValue = "") String regNumber,
            @RequestParam(required = false) Long id,
            @RequestParam(defaultValue = "false") boolean download
    ){
        List<BusResponseDto> buses = service.getBusesResponse();

        if(!depot.isEmpty()) {
            buses = buses.stream().filter(bus -> bus.depot().equalsIgnoreCase(depot)).toList();
        };
        if(download) {
            try {
                ByteArrayOutputStream stream = service.exportBusesToExcel(buses);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                headers.setContentDispositionFormData(
                        "attachment", "buses" + LocalDate.now() + ".xlsx");

                return ResponseEntity.ok().headers(headers).body(stream.toByteArray());
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Error generating Excel file: " + e.getMessage());
            }
        }
        if(id != null){
            return ResponseEntity.of(service.getBusById(id));
        }
        if(!regNumber.isEmpty()) {
            return ResponseEntity.of(service.getBusResponseByRegNumber(regNumber));
        }

        return ResponseEntity.ok(buses);
    }

    @GetMapping("/page")
    public Page<BusResponseDto> getPaged(
            @PageableDefault(size = 20, sort = "regNumber")Pageable pageable
            ){
        return service.getBusesPageable(pageable);
    }

    @GetMapping("/permits")
    public ResponseEntity<?> getExpiredPermits(
            @RequestParam boolean expired,
            @RequestParam boolean expiring,
            @RequestParam boolean valid,
            @RequestParam(required = false) String regNumber,
            @RequestParam(defaultValue = "") String depot,
            @RequestParam(defaultValue = "false") boolean download
    ){
        List<Permits> permits = new ArrayList<>();
        HashMap<PermitStatus, List<Permits>> allPermits = service.generatePermits();

        if(expired){
            permits.addAll(allPermits.get(PermitStatus.Expired));
        }
        if(expiring){
            permits.addAll(allPermits.get(PermitStatus.AlmostExpired));
        }
        if(valid){
            permits.addAll(allPermits.get(PermitStatus.Valid));
        }
        if(!depot.isEmpty()){
            permits = permits.stream().filter(permit->permit.depot().equalsIgnoreCase(depot)).toList();
        }
        if(regNumber != null){
            permits = permits.stream().filter(permit->permit.regNumber().equalsIgnoreCase(regNumber)).toList();
        }
        if(download) {
            try {
                ByteArrayOutputStream stream = service.exportPermitsToExcel(permits);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType(
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                headers.setContentDispositionFormData(
                        "attachment", "bus_permits_" + LocalDate.now() + ".xlsx");

                return ResponseEntity.ok().headers(headers).body(stream.toByteArray());
            } catch (Exception e) {
                return ResponseEntity.internalServerError().body("Error generating Excel file: " + e.getMessage());
            }
        }
        return ResponseEntity.ok(permits);
    }

    @PostMapping("/permits/update")
    public void updatePermit(@RequestBody Permits permits) throws IllegalAccessException {
        service.changePermitDate(permits);
    }

    @PostMapping
    public Bus addBus(@RequestBody BusCreateDto dto){
        return service.addBus(dto);
    }

    @PostMapping("/change/{id}")
    public Bus changeRegNumber(@PathVariable Long id, @RequestParam String regNumber){
        return service.changeRegNumber(id,regNumber);
    }

    @PostMapping("/")
    public Bus changeDepot(@PathVariable Long id, @RequestParam String depot){
        return service.changeDepot(id,depot);
    }

    @DeleteMapping
    public ResponseEntity<?> deleteBus(@RequestParam String regNumber){
        if(service.deleteBusByRegNumber(regNumber)){
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/all")
    public void deleteAll(){
        service.deleteAll();
    }
}
