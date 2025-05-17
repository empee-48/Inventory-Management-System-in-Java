package com.inventory.permits.service;

import com.inventory.permits.entity.Bus;
import com.inventory.permits.entity.Permits;
import com.inventory.permits.repo.BusRepo;
import com.inventory.permits.service.dto.BusCreateDto;
import com.inventory.permits.service.dto.BusResponseDto;
import com.inventory.permits.service.dto.PermitStatus;
import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class BusService {
    private final BusRepo repo;

    /**
     *
     * @return List of all bus permits
     */
    public List<Bus> getBuses(){
        return repo.findAll();
    }

    public List<BusResponseDto> getBusesWithExpired() {
        return getBuses().stream().map(bus-> {
            try {
                return busToResponse(bus);
            } catch (IllegalAccessException e) {
                throw new RuntimeException(e);
            }
        }).toList();
    }

    public Page<BusResponseDto> getBusesPageable(Pageable pageable){
        Page<Bus> busPage = repo.findAll(pageable);

        try{
            return busPage.map(bus -> {
                try {
                    return busToResponse(bus);
                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            });
        }
        catch (Exception ex){
            ex.printStackTrace();
        }
        return null;
    }

    public BusResponseDto busToResponse(Bus bus) throws IllegalAccessException{
        PermitStatus busStatus = getBusStatus(bus);

        return new BusResponseDto(
                bus.getId(),
                bus.getRegNumber(),
                bus.getDepot(),
                bus.getPassengerInsurance(),
                bus.getVehicleInsurance(),
                bus.getVehicleLicence(),
                bus.getCertificateOfFitness(),
                bus.getRouteAuthority(),
                busStatus
        );
    }

    public PermitStatus getBusStatus(Bus bus) {
        return Arrays.stream(bus.getClass().getDeclaredFields())
                .filter(field -> field.getType().equals(LocalDate.class)) // 1. Find LocalDate fields
                .peek(field -> field.setAccessible(true)) // 2. Enable private field access
                .map(field -> {
                    try {
                        LocalDate date = (LocalDate) field.get(bus);
                        return date != null ? checkDateStatus(date) : PermitStatus.Valid; // 3. Default to Valid if null
                    } catch (IllegalAccessException e) {
                        throw new RuntimeException("Failed to read field: " + field.getName(), e);
                    }
                })
                .max(Comparator.comparing(Enum::ordinal)) // 4. Find the WORST status (highest ordinal)
                .orElse(PermitStatus.Valid); // 5. Default if no dates found
    }

    private PermitStatus checkDateStatus(LocalDate date) {
        LocalDate today = LocalDate.now();
        if (date.isBefore(today)) {
            return PermitStatus.Expired;
        } else if (date.isBefore(today.plusMonths(1))) {
            return PermitStatus.AlmostExpired;
        } else {
            return PermitStatus.Valid;
        }
    }

    /**
     *
     * @param id
     * @return bus permits of bus with id
     */
    public Bus getBus(Long id){
        return repo.findById(id).orElseThrow(()->new NoSuchElementException("Vehicle Not Found"));
    }

    public BusResponseDto getBusWithExpired(Long id) throws IllegalAccessException {
        return busToResponse(getBus(id));
    }

    public BusResponseDto getBusByRegNumberWithExpired(String regNumber) throws IllegalAccessException {
        return busToResponse(getBusByRegNumber(regNumber.toUpperCase()));
    }

    /**
     *
     * @param regNumber
     * @return bus permits of bus with reg number...
     */
    public Bus getBusByRegNumber(String regNumber){
        return repo.findByRegNumber(regNumber).orElseThrow(()->new NoSuchElementException("Vehicle Not Found"));
    }

    /**
     * adds bus permits to the database
     * @param dto
     * @return added bus, didn't implement mappers so it does the dto to bus operation...
     */
    public Bus addBus(BusCreateDto dto){
        Bus bus = Bus.builder()
                .regNumber(dto.regNumber().toUpperCase())
                .depot(dto.depot())
                .passengerInsurance(dto.passengerInsurance())
                .vehicleLicence(dto.vehicleLicense())
                .vehicleInsurance(dto.vehicleInsurance())
                .certificateOfFitness(dto.certificateOfFitness())
                .routeAuthority(dto.routeAuthority())
                .build();

        return repo.save(bus);
    }

    /**
     * generate 3 groups of permits, expired, almost expired and then all.
     * @return hashmap containing the different permits
     */
    public HashMap<String,List<Permits>> generatePermits(){
        List<Permits> expiredPermits = new ArrayList<>();
        List<Permits> expiringWithinOneMonthPermits = new ArrayList<>();
        List<Permits> allPermits = new ArrayList<>();

        HashMap<String,List<Permits>> permitsMap = new HashMap<>();

        List<Bus> buses = repo.findAll();

        buses.forEach(bus -> {
            List<Field> fields = Arrays.stream(bus.getClass().getDeclaredFields())
                    .filter(field -> field.getType().equals(LocalDate.class))
                    .peek(f -> f.setAccessible(true))
                    .toList();

            System.out.println(fields);

            fields.forEach(field -> {
               try {
                   LocalDate expirationDate = (LocalDate) field.get(bus);

                   Permits permits = Permits.builder()
                           .permitType(StringUtils.capitalize(field.getName()))
                           .expirationDate(expirationDate)
                           .regNumber(bus.getRegNumber())
                           .build();

                   if(expirationDate.isBefore(LocalDate.now())) expiredPermits.add(permits);

                   else if (expirationDate.isBefore(LocalDate.now().plusMonths(1))) expiringWithinOneMonthPermits.add(permits);

                   allPermits.add(permits);

                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            });
        });
        permitsMap.put("expiredPermits",expiredPermits);
        permitsMap.put("expiringPermits",expiringWithinOneMonthPermits);
        permitsMap.put("allPermits",allPermits);
        return permitsMap;
    }

    /**
     * changes the date of a permit
     * @param permit
     * @throws IllegalAccessException
     */
    public void changePermitDate(Permits permit) throws IllegalAccessException {
        Bus bus = getBusByRegNumber(permit.regNumber());
        Field[] fields = bus.getClass().getDeclaredFields();
        for (Field field : fields) {
            if(field.getName().equalsIgnoreCase(permit.permitType())){
                field.setAccessible(true);
                field.set(bus,permit.expirationDate());
                field.setAccessible(false);
            }
        }
        repo.save(bus);
    }

    public Bus changeRegNumber(Long id, String regNumber){
        Bus bus = getBus(id);
        bus.setRegNumber(regNumber);

        return repo.save(bus);
    }

    public Bus changeDepot(Long id, String depot){
        Bus bus = getBus(id);
        bus.setDepot(depot);

        return repo.save(bus);
    }
}
