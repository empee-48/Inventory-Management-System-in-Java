package com.inventory.controller;

import com.inventory.entity.Item;
import com.inventory.service.ItemService;
import com.inventory.service.dto.ItemCreateDto;
import com.inventory.service.dto.ItemResponseDto;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("inventory/api/items")
public class ItemController {
    final public ItemService itemService;

    public ItemController(ItemService itemService) {
        this.itemService = itemService;
    }

    @GetMapping
    public List<ItemResponseDto> allItems(@RequestParam(required = false) String name) {
        return itemService.allItems();
    }

    @GetMapping("/{id}")
    public ItemResponseDto findItem(@PathVariable Long id){
        return itemService.findItem(id);
    }

    @ResponseStatus(HttpStatus.CREATED)
    @PostMapping("")
    public Item createItem(@Valid @RequestBody ItemCreateDto dto){
        return itemService.createItem(dto);
    }

    @DeleteMapping("/{id}")
    public void deleteItem(@PathVariable Long id){
        itemService.deleteItem(id);
    }

    @GetMapping("/items")
    public List<Item> items(){
        return itemService.specialItems();
    }

}
