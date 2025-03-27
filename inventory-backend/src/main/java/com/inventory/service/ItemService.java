package com.inventory.service;

import com.inventory.service.dto.ItemCreateDto;
import com.inventory.service.dto.ItemResponseDto;
import com.inventory.entity.Item;
import com.inventory.repo.ItemRepo;
import com.inventory.service.mapper.ItemMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ItemService {
    final public ItemRepo itemRepo;
    final public ItemMapper itemMapper;

    public ItemService(ItemRepo itemRepo,ItemMapper itemMapper) {
        this.itemRepo = itemRepo;
        this.itemMapper = itemMapper;
    }

    public List<ItemResponseDto> allItems(){
        return itemRepo.findAll(Sort.by(Sort.Direction.ASC, "serialNumber")).stream().map(itemMapper::itemToResponse).toList();
    }

    public ItemResponseDto findItem(Long id){
        return itemMapper.itemToResponse(itemRepo.findById(id).orElseThrow(NoSuchElementException::new));
    }

    public Item createItem(ItemCreateDto dto){
        return itemRepo.save(itemMapper.createToItem(dto));
    }

    public void deleteItem(Long id){
        Item item=itemRepo.findById(id).orElseThrow(NoSuchElementException::new);
        itemRepo.delete(item);
    }
    public List<Item> specialItems(){
        return itemRepo.findAll(Sort.by(Sort.Direction.ASC, "serialNumber"));
    }

    public List<ItemResponseDto> getItemsByName(String name){
        return itemRepo.findItemsByNameIgnoreCase(name.toLowerCase()).stream().map(itemMapper::itemToResponse).toList();
    }
}
