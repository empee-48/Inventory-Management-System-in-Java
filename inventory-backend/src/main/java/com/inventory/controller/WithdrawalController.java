package com.inventory.controller;

import com.inventory.entity.Withdrawal;
import com.inventory.service.WithdrawalService;
import com.inventory.service.dto.WithdrawalCreateDto;
import com.inventory.service.dto.WithdrawalResponseDto;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("inventory/api/withdrawals")
@CrossOrigin
public class WithdrawalController {

    final private WithdrawalService service;

    public WithdrawalController(WithdrawalService service) {
        this.service = service;
    }

    @GetMapping("")
    public List<WithdrawalResponseDto> allWithdrawal(){
        return service.allWithdrawal();
    }

    @GetMapping("/{id}")
    public Withdrawal getWithdrawal(@PathVariable Long id){
        return service.getWithdrawal(id);
    }

    @GetMapping("/item/{id}")
    public List<WithdrawalResponseDto> getWithdrawalByItem(@PathVariable Long id){
        return service.getWithdrawalByItem(id);
    }
    @DeleteMapping("/{id}")
    public void deleteWithdrawal(@PathVariable Long id){
        service.deleteWithdrawal(id);
    }

    @PostMapping("")
    public Withdrawal createWithdrawal(@Valid @RequestBody WithdrawalCreateDto dto){
        return service.createWithdrawal(dto);
    }
}
