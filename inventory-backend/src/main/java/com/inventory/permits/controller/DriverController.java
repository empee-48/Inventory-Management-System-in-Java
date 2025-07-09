package com.inventory.permits.controller;

import com.inventory.permits.entity.Driver;
import com.inventory.permits.service.DriverService;
import com.inventory.permits.service.dto.DriverCreateDto;
import com.inventory.permits.service.dto.DriverDocResponse;
import com.inventory.permits.service.dto.DriverResponseDto;
import com.inventory.utils.PermitStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("inventory/api/drivers")
public class DriverController {
    private final DriverService service;

    @GetMapping
    public ResponseEntity<?> getDrivers(
            @RequestParam(required = false) Long id,
            @RequestParam(defaultValue = "") String driverId,
            @RequestParam(defaultValue = "") String depot,
            @RequestParam(defaultValue = "false") boolean download
    ){
        List<DriverResponseDto> drivers = service.getDrivers();

        if(!depot.isEmpty()){
            drivers = drivers.stream().filter(driver->driver.depot().equalsIgnoreCase(depot)).toList();
        }
        if(download) {
            try {
                ByteArrayOutputStream stream = service.exportDriversToExcel(drivers);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                headers.setContentDispositionFormData("attachment", "drivers.xlsx");

                return ResponseEntity.ok()
                        .headers(headers)
                        .body(stream.toByteArray());
            } catch (Exception e) {
                return ResponseEntity.internalServerError()
                        .body("Error generating Excel file");
            }
        }
        if(id != null){
            return ResponseEntity.of(service.getDriver(id));
        }
        if(!driverId.isEmpty()){
            return ResponseEntity.of(service.getDriverByDriverId(driverId));
        }
        return ResponseEntity.ok(drivers);
    }

    @PostMapping
    public ResponseEntity<Driver> createDriver(@RequestBody DriverCreateDto dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.createDriver(dto));
    }

    @DeleteMapping
    public ResponseEntity<?> deleteDriver(
            @RequestParam String id
    ){
        if(service.deleteDriver(id)){
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/all")
    public void deleteAll(){
        service.deleteAll();
    }

    @GetMapping("/docs")
    public ResponseEntity<?> geDriverDocs(
            @RequestParam boolean expired,
            @RequestParam boolean expiring,
            @RequestParam boolean valid,
            @RequestParam(required = false) String driverId,
            @RequestParam(defaultValue = "") String depot,
            @RequestParam(required = false) boolean download
    ){
        List<DriverDocResponse> docs = new ArrayList<>();
        HashMap<PermitStatus, List<DriverDocResponse>> allDocs = service.getDriverDocs();

        if(expired){
            docs.addAll(allDocs.get(PermitStatus.Expired));
        }
        if(expiring){
            docs.addAll(allDocs.get(PermitStatus.AlmostExpired));
        }
        if(valid){
            docs.addAll(allDocs.get(PermitStatus.Valid));
        }
        if(!depot.isEmpty()){
            docs = docs.stream().filter(doc->doc.depot().equalsIgnoreCase(depot)).toList();
        }
        if(driverId != null){
            docs = docs.stream().filter(doc->doc.driverId().equalsIgnoreCase(driverId)).toList();
        }
        if(download) {
            try {
                ByteArrayOutputStream stream = service.exportToExcel(docs);
                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                headers.setContentDispositionFormData("attachment", "driver_docs.xlsx");

                return ResponseEntity.ok()
                        .headers(headers)
                        .body(stream.toByteArray());
            } catch (Exception e) {
                return ResponseEntity.internalServerError()
                        .body("Error generating Excel file");
            }
        }
        // Return normal JSON response
        return ResponseEntity.ok(docs);
    }

    @PostMapping("/docs/update")
    public Driver updateDoc(@RequestBody DriverDocResponse doc){
        return service.updateDriverDoc(doc);
    }
}
