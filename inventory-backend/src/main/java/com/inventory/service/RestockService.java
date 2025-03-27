package com.inventory.service;

import com.inventory.entity.Item;
import com.inventory.entity.Restock;
import com.inventory.repo.ItemRepo;
import com.inventory.repo.RestockRepo;
import com.inventory.service.dto.RestockCreateDto;
import com.inventory.service.dto.RestockResponseDto;
import com.inventory.service.mapper.RestockMapper;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class RestockService {

    final public RestockRepo restockRepo;
    final private ItemRepo itemRepo;
    final public RestockMapper mapper;

    public RestockService(RestockRepo restockRepo, ItemRepo itemRepo, RestockMapper mapper) {
        this.restockRepo = restockRepo;
        this.itemRepo = itemRepo;
        this.mapper = mapper;
    }

    public RestockResponseDto createRestock(RestockCreateDto dto){
        Restock restock=mapper.createToRestock(dto);
        Item item = itemRepo.findById(restock.getItem().getId()).orElseThrow(NoSuchElementException::new);
        item.setInstock(item.getInstock()+ restock.getAmount());
        itemRepo.save(item);
        LocalDateTime now= LocalDateTime.now();
        restock.setItemTimeStamp(now);
        restockRepo.save(restock);

        return mapper.restockToResponse(restock);
    }

    public Restock getRestock(Long id){
        return restockRepo.findById(id).orElseThrow(NoSuchElementException::new);
    }

    public void deleteRestock(Long id) {
        Restock restock = restockRepo.findById(id).orElseThrow(NoSuchElementException::new);
        Item item = itemRepo.findById(restock.getItem().getId()).orElseThrow(NoSuchElementException::new);

        double availableQuantity = item.getInstock();
        double restockAmount = restock.getAmount();

        if (restockAmount > availableQuantity) {
            throw new IllegalArgumentException(String.format("Restock deletion will cause amount of %s to exceed Zero",item.getName()));
        }

        item.setInstock(availableQuantity - restockAmount);
        itemRepo.save(item);
        restockRepo.delete(restock);

    }

    public List<RestockResponseDto> allRestock(){
        return restockRepo.findAll(Sort.by(Sort.Direction.DESC, "itemTimeStamp")).stream().map(mapper::restockToResponse).toList();
    }

    public List<RestockResponseDto> getRestocksByItemId(Long id) {
        return restockRepo.findRestocksByItemId(id,Sort.by(Sort.Direction.DESC, "itemTimeStamp")).stream().map(mapper::restockToResponse).toList();
    }
}
