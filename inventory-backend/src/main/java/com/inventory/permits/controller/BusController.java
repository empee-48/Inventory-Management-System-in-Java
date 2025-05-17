package com.inventory.permits.controller;

import com.inventory.permits.entity.Bus;
import com.inventory.permits.entity.Permits;
import com.inventory.permits.service.BusService;
import com.inventory.permits.service.dto.BusCreateDto;
import com.inventory.permits.service.dto.BusResponseDto;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/permits/api/buses")
@RequiredArgsConstructor
public class BusController {
    private final BusService service;

    @GetMapping
    public List<BusResponseDto> getAll(
            @RequestParam(required = false) String depot
    ){
        List<BusResponseDto> buses = service.getBusesWithExpired();
        if(depot != null && !depot.isEmpty()) buses = buses.stream().filter(bus -> bus.depot().equalsIgnoreCase(depot)).toList();
        return buses;
    }

    @GetMapping("/bus")
    public BusResponseDto getAll(
            @RequestParam(required = false) String regNumber,
            @RequestParam(required = false) Long id
    ){
        try {
            if (regNumber != null && !regNumber.isEmpty()) {
                return service.getBusByRegNumberWithExpired(regNumber);
            }
            if (id != null) {
                return service.getBusWithExpired(id);
            }
        }
        catch (IllegalAccessException e){
            e.printStackTrace();
        }
        return null;
    }

    @GetMapping("/page")
    public Page<BusResponseDto> getPaged(
            @PageableDefault(size = 20, sort = "regNumber")Pageable pageable
            ){
        return service.getBusesPageable(pageable);
    }

    @GetMapping("/{id}")
    public Bus getBus(@PathVariable Long id){
        return service.getBus(id);
    }

    @GetMapping("/permits")
    public List<Permits> getExpiredPermits(
            @RequestParam(defaultValue = "allPermits") String permitType,
            @RequestParam(required = false) String regNumber

    ){
        List<Permits> permits = service.generatePermits().get(permitType);

        if (regNumber != null && !regNumber.isEmpty() && permits != null) {
            permits = permits.stream().filter(permit -> permit.regNumber().equalsIgnoreCase(regNumber)).toList();
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
}
