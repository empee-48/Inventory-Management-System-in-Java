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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

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
            @RequestParam(required = false) Long id
    ){
        if(id != null){
            return ResponseEntity.of(service.getBusById(id));
        }
        if(!regNumber.isEmpty()) {
            return ResponseEntity.of(service.getBusResponseByRegNumber(regNumber));
        }
        if(!depot.isEmpty()) {
            service.getBusesResponse().stream().filter(bus -> bus.depot().equalsIgnoreCase(depot)).toList();
        };
        return ResponseEntity.ok(service.getBusesResponse());
    }

    @GetMapping("/page")
    public Page<BusResponseDto> getPaged(
            @PageableDefault(size = 20, sort = "regNumber")Pageable pageable
            ){
        return service.getBusesPageable(pageable);
    }

    @GetMapping("/permits")
    public List<Permits> getExpiredPermits(
            @RequestParam boolean expired,
            @RequestParam boolean expiring,
            @RequestParam boolean valid,
            @RequestParam(required = false) String regNumber,
            @RequestParam(defaultValue = "") String depot
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
            return permits.stream().filter(permit->permit.depot().equalsIgnoreCase(depot)).toList();
        }
        if(regNumber != null){
            return permits.stream().filter(permit->permit.regNumber().equalsIgnoreCase(regNumber)).toList();
        }
        return permits;
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
