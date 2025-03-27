package com.inventory.controller;

import com.inventory.entity.Restock;
import com.inventory.service.RestockService;
import com.inventory.service.dto.RestockCreateDto;
import com.inventory.service.dto.RestockResponseDto;
import jakarta.validation.Valid;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin
@RequestMapping("inventory/api/restocks")
public class RestockController {

    final private RestockService service;

    public RestockController(RestockService service) {
        this.service = service;
    }

    @GetMapping("")
    public List<RestockResponseDto> allRestock(){
        return service.allRestock();
    }

    @GetMapping("/{id}")
    public Restock getRestock(@PathVariable Long id){
        return service.getRestock(id);
    }

    @GetMapping("/item/{id}")
    public List<RestockResponseDto> getRestocksByItemId(@PathVariable Long id){
        return service.getRestocksByItemId(id);
    }

    @DeleteMapping("/{id}")
    public void deleteRestock(@Valid @PathVariable Long id){
        service.deleteRestock(id);
    }

    @PostMapping("")
    public RestockResponseDto createRestock(@RequestBody RestockCreateDto dto){
        return service.createRestock(dto);
    }
}
