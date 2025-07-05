package com.inventory.permits.service;

import com.inventory.permits.entity.Driver;
import com.inventory.permits.entity.DriverDoc;
import com.inventory.permits.repo.DriverDocRepo;
import com.inventory.permits.service.dto.DriverCreateDto;
import com.inventory.permits.service.dto.DriverDocResponse;
import com.inventory.permits.service.dto.DriverResponseDto;
import com.inventory.utils.DriverDocType;
import com.inventory.utils.PermitStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DriverMapper {
    private final DriverDocRepo repo;

    public Driver createToDriver(DriverCreateDto dto){
        DriverDoc medical = DriverDoc.builder()
                .docType(DriverDocType.Medical)
                .expirationDate(dto.medical())
                .build();

        DriverDoc retest = DriverDoc.builder()
                .docType(DriverDocType.Retest)
                .expirationDate(dto.retest())
                .build();

        DriverDoc defensive = DriverDoc.builder()
                .docType(DriverDocType.Defensive)
                .expirationDate(dto.defensive())
                .build();

        return Driver.builder()
                .firstName(dto.firstName())
                .lastName(dto.lastName())
                .phone(dto.phone())
                .depot(dto.depot())
                .medical(repo.save(medical))
                .retest(repo.save(retest))
                .defensive(repo.save(defensive))
                .build();
    }

    public DriverResponseDto driverToResponse(Driver driver){

        return new DriverResponseDto(
                driver.getDriverId(),
                driver.getFirstName(),
                driver.getLastName(),
                driver.getPhone(),
                driver.getDepot(),
                driver.getRetest().getExpirationDate(),
                driver.getMedical().getExpirationDate(),
                driver.getDefensive().getExpirationDate(),
                getDriverStatus(driver)
        );
    }

    public PermitStatus getDocStatus(DriverDoc doc){
        if(doc.getExpirationDate().isBefore(LocalDate.now())){
            return PermitStatus.Expired;
        } else if (doc.getExpirationDate().isBefore(LocalDate.now().plusMonths(1))) {
            return PermitStatus.AlmostExpired;
        }
        else{
            return PermitStatus.Valid;
        }
    }

    public PermitStatus getDriverStatus(Driver driver){
        PermitStatus[] statusList = {getDocStatus(driver.getDefensive()), getDocStatus(driver.getMedical()), getDocStatus(driver.getRetest())};

        int maxOrdinal = statusList[0].ordinal();
        PermitStatus maxStatus = statusList[0];

        for(PermitStatus status: statusList){
            if(status.ordinal()>maxOrdinal){
                maxOrdinal = status.ordinal();
                maxStatus = status;
            }
        }
        return maxStatus;
    }

    public DriverDocResponse driverDocToResponse(DriverDoc doc, Driver driver){
        String fullName = driver.getFirstName() + " " + driver.getLastName();
        return new DriverDocResponse(
                driver.getDriverId(),
                fullName,
                driver.getDepot(),
                doc.getDocType(),
                doc.getExpirationDate()
        );
    }
}
