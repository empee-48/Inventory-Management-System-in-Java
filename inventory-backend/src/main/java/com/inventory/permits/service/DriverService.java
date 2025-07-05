package com.inventory.permits.service;

import com.inventory.permits.entity.Driver;
import com.inventory.permits.entity.DriverDoc;
import com.inventory.permits.service.dto.DriverDocResponse;
import com.inventory.permits.repo.DriverRepo;
import com.inventory.permits.service.dto.DriverCreateDto;
import com.inventory.permits.service.dto.DriverResponseDto;
import com.inventory.utils.DriverDocType;
import com.inventory.utils.PermitStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DriverService {
    private final DriverMapper mapper;
    private final DriverRepo repo;

    public List<DriverResponseDto> getDrivers(){
        return repo.findAll().stream().map(mapper::driverToResponse).toList();
    }

    public Optional<DriverResponseDto> getDriver(Long id){
        return repo.findById(id).map(mapper::driverToResponse);
    }

    public Driver createDriver(DriverCreateDto dto){
        Driver driver = repo.save(mapper.createToDriver(dto));
        String generatedCode = String.format("DR%d", 1000+ driver.getId());
        driver.setDriverId(generatedCode);
        return repo.save(driver);
    }

    public boolean deleteDriver(String id){
        try{
            Driver driver = repo.findByDriverId(id).get();
            repo.delete(driver);
            return true;
        }
        catch (NoSuchElementException e){
            return false;
        }
    }

    public void deleteAll(){
        repo.deleteAll();
    }

    /**
     * creates new hashmap with 3 lists of driver doc responses
     * iterates through each driver and adds it to the appropriate list using
     * the getDocStatus function
     * @return generated hashmap
     */
    public HashMap<PermitStatus, List<DriverDocResponse>> getDriverDocs(){
        HashMap<PermitStatus, List<DriverDocResponse>> hashMap = new HashMap<>();
        hashMap.put(PermitStatus.Valid, new ArrayList<>());
        hashMap.put(PermitStatus.AlmostExpired, new ArrayList<>());
        hashMap.put(PermitStatus.Expired, new ArrayList<>());

        List<Driver> drivers = repo.findAll();
        drivers.forEach(driver -> {
            hashMap.get(mapper.getDocStatus(driver.getMedical())).add(mapper.driverDocToResponse(driver.getMedical(),driver));
            hashMap.get(mapper.getDocStatus(driver.getRetest())).add(mapper.driverDocToResponse(driver.getRetest(),driver));
            hashMap.get(mapper.getDocStatus(driver.getDefensive())).add(mapper.driverDocToResponse(driver.getDefensive(),driver));
        });
        return hashMap;
    }

    public Optional<DriverResponseDto> getDriverByDriverId(String driverId) {
        return repo.findByDriverId(driverId).map(mapper::driverToResponse);
    }

    public Driver updateDriverDoc(DriverDocResponse doc){
        Driver driver = repo.findByDriverId(doc.driverId()).get();
        switch (doc.type()){
            case DriverDocType.Medical: driver.getMedical().setExpirationDate(doc.expirationDate());
            case DriverDocType.Retest: driver.getRetest().setExpirationDate(doc.expirationDate());
            case DriverDocType.Defensive: driver.getDefensive().setExpirationDate(doc.expirationDate());
        }
        return repo.save(driver);
    }
}
