package com.inventory.permits.service;

import com.inventory.permits.entity.Bus;
import com.inventory.permits.service.dto.Permits;
import com.inventory.permits.repo.BusRepo;
import com.inventory.permits.service.dto.BusCreateDto;
import com.inventory.permits.service.dto.BusResponseDto;
import com.inventory.utils.PermitStatus;
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

    public List<BusResponseDto> getBusesResponse() {
        return getBuses().stream().map(this::busToResponse).toList();
    }

    public Page<BusResponseDto> getBusesPageable(Pageable pageable){
        Page<Bus> busPage = repo.findAll(pageable);
        return busPage.map(this::busToResponse);
    }

    /**
     * Used get method on an optional
     * @param bus
     * @return
     */
    public BusResponseDto busToResponse(Bus bus){
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

    /**
     * ohhh something terrible happened here
     * @param bus
     * @return optional of permit status
     */
    public PermitStatus getBusStatus(Bus bus) {
        return Arrays.stream(bus.getClass().getDeclaredFields())
                .filter(field -> field.getType().equals(LocalDate.class)) // 1. Find LocalDate fields
                .peek(field -> field.setAccessible(true)) // 2. Enable private field access
                .map(field -> {
                    try {
                        LocalDate date = (LocalDate) field.get(bus);
                        return date != null ? checkDateStatus(date) : PermitStatus.Valid; // 3. Default to Valid if null
                    } catch (IllegalAccessException e) {
                        e.printStackTrace();
                    }
                    return null;
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
     * this is an abomination
     * @param id
     * @return
     */
    public Bus getBus(Long id){
        return repo.findById(id).orElseThrow(()->new NoSuchElementException("Vehicle Not Found"));
    }

    public Optional<BusResponseDto> getBusById(Long id){
        return repo.findById(id).map(this::busToResponse);
    }

    public Optional<Bus> getBusByRegNumber(String regNumber){
        return repo.findByRegNumber(regNumber);
    }
    public Optional<BusResponseDto> getBusResponseByRegNumber(String regNumber){
        return getBusByRegNumber(regNumber).map(this::busToResponse);
    }
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
    public HashMap<PermitStatus,List<Permits>> generatePermits(){
        List<Permits> expiredPermits = new ArrayList<>();
        List<Permits> expiringWithinOneMonthPermits = new ArrayList<>();
        List<Permits> validPermits = new ArrayList<>();

        HashMap<PermitStatus,List<Permits>> permitsMap = new HashMap<>();

        List<Bus> buses = repo.findAll();

        buses.forEach(bus -> {
            List<Field> fields = Arrays.stream(bus.getClass().getDeclaredFields())
                    .filter(field -> field.getType().equals(LocalDate.class))
                    .peek(f -> f.setAccessible(true))
                    .toList();

            fields.forEach(field -> {
               try {
                   LocalDate expirationDate = (LocalDate) field.get(bus);

                   Permits permits = Permits.builder()
                           .type(StringUtils.capitalize(field.getName()))
                           .expirationDate(expirationDate)
                           .regNumber(bus.getRegNumber())
                           .depot(bus.getDepot())
                           .build();

                   if(expirationDate.isBefore(LocalDate.now())) expiredPermits.add(permits);

                   else if (expirationDate.isBefore(LocalDate.now().plusMonths(1))) expiringWithinOneMonthPermits.add(permits);

                   else validPermits.add(permits);

                } catch (IllegalAccessException e) {
                    throw new RuntimeException(e);
                }
            });
        });
        permitsMap.put(PermitStatus.Expired,expiredPermits);
        permitsMap.put(PermitStatus.AlmostExpired,expiringWithinOneMonthPermits);
        permitsMap.put(PermitStatus.Valid,validPermits);
        return permitsMap;
    }

    /**
     * changes the date of a permit. something terrible also happened...used get method on an
     * Optional
     * @param permit
     * @throws IllegalAccessException
     */
    public void changePermitDate(Permits permit) throws IllegalAccessException {
        Bus bus = getBusByRegNumber(permit.regNumber()).get();
        Field[] fields = bus.getClass().getDeclaredFields();
        for (Field field : fields) {
            if(field.getName().equalsIgnoreCase(permit.type())){
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

    public boolean deleteBusByRegNumber(String regNumber){
        try{
            Bus bus = repo.findByRegNumber(regNumber).get();
            repo.delete(bus);
            return true;
        } catch (NoSuchElementException e){
            return false;
        }
    }

    public void deleteAll(){
        repo.deleteAll();
    }
}
