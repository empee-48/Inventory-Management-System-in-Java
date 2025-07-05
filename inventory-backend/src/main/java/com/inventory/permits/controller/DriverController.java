package com.inventory.permits.controller;

import com.inventory.permits.entity.Driver;
import com.inventory.permits.service.DriverService;
import com.inventory.permits.service.dto.DriverCreateDto;
import com.inventory.permits.service.dto.DriverDocResponse;
import com.inventory.permits.service.dto.DriverResponseDto;
import com.inventory.utils.PermitStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(defaultValue = "") String driverId
    ){
        if(id != null){
            return ResponseEntity.of(service.getDriver(id));
        }
        if(!driverId.isEmpty()){
            return ResponseEntity.of(service.getDriverByDriverId(driverId));
        }
        return ResponseEntity.ok(service.getDrivers());
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
    public List<DriverDocResponse> geDriverDocs(
            @RequestParam boolean expired,
            @RequestParam boolean expiring,
            @RequestParam boolean valid,
            @RequestParam(required = false) String driverId,
            @RequestParam(defaultValue = "") String depot
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
            return docs.stream().filter(doc->doc.depot().equalsIgnoreCase(depot)).toList();
        }
        if(driverId != null){
            return docs.stream().filter(doc->doc.driverId().equalsIgnoreCase(driverId)).toList();
        }
        return docs;
    }

    @PostMapping("/docs/update")
    public Driver updateDoc(@RequestBody DriverDocResponse doc){
        return service.updateDriverDoc(doc);
    }
}
