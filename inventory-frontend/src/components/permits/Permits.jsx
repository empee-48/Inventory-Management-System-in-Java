import React, { useState } from 'react';
import './Permits.css';
import { useQuery } from '@tanstack/react-query';
import { FetchSource } from '../utilities/FetchSource';
import { Loader } from '../utilities/Loader';
import { ErrorOutput } from '../utilities/ErrorOutput';
import { equalsIgnoreCase } from '../utilities/EqualsIgnoreCase';
import moment from 'moment';
import Select from 'react-select'; // Correct import
import classNames from 'classnames';
import { ShowBus } from './showBus';
import { LuChevronsLeft } from "react-icons/lu";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

export const Permits = () => {
  const [showBus, setShowBus] = useState(false);
  const [regNumber, setRegNumber] = useState();
  const [busOptions,setBusOptions] = useState([]);
  const [depotOptions,setDepotOptions] = useState([]);
  const { permitSource } = FetchSource();
  const [buses, setBuses] = useState()
  const [permitStatusFilter,setPermitStatusFilter] = useState("All")
  

  const permitStatusOptions = [
    {label: "--All--", value: "All"},
    {label:"Valid", value: "Valid"},
    {label: "Almost Expired", value: "AlmostExpired"},
    {label: "Expired", value: "Expired"}
  ]

  const fetchPermits = async () => {
    const tempListBuses = [];
    const tempListDepot = [{ value: "All", label: "--All--" }];

    const response = await fetch(permitSource);
    const data = await response.json();

    data.forEach(bus => {
        const regNumber = bus.regNumber;
        const depot = bus.depot;

        tempListBuses.push({ value: regNumber, label: regNumber }); // Use value and label

        if (!tempListDepot.some(option => option.value === depot)) {
            tempListDepot.push({ value: depot, label: depot });
        }
    });

    setBusOptions(tempListBuses);
    setDepotOptions(tempListDepot);
    setBuses(data);
    
    return data;
};

  const { data: rawBuses, isLoading, error,refetch } = useQuery({
    queryKey: ["busPermits"],
    queryFn: fetchPermits
  });

  const handleShowBus = regNumber => {
    setRegNumber(regNumber);
    setShowBus(true);
  };

  const handleDepotParam = depot => {
    if(depot === "All"){
      setBuses(rawBuses)
    }
    else{
      setBuses(rawBuses.filter(bus=>equalsIgnoreCase(bus.depot, depot)));
    }
    if(permitStatusFilter !== "All"){
      setBuses(buses.filter(bus=>bus.status === permitStatusFilter))
    }
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorOutput message={error.message} />;
  }

  return (
    <div className=''>
      <div className='mx-auto w-fit'>
        <div className=' bg-gradient-to-tl mb-2 rounded p-1 from-purple-600 to-purple-800 px-10 border-2 border-purple-600'>
          <h1 className='text-3xl text-gray-200 border-b mb-2 border-gray-500'>Filters</h1>
         <div className='flex gap-10 mb-2'>
          <Select
            className='w-72 mb-1 capitalize'
            placeholder="Filter depots..."
            options={depotOptions}
            onChange={(selectedOption) => handleDepotParam(selectedOption.value)} // Handle selection
          />
          <Select
            className='w-72 mb-1'
            placeholder="Filter buses..."
            options={busOptions}
            onChange={(selectedOption) => handleShowBus(selectedOption.value)} // Handle selection
          />
          <Select
            className='w-72 mb-1'
            placeholder="Filter Permits Status..."
            options={permitStatusOptions}
            onChange={(selectedOption) => setPermitStatusFilter(selectedOption.value)} // Handle selection
          />
          </div>
        </div>
        <div className='car-table shadow-2xl shadow-gray-400'>
          <div className='head tr'>
            <span className='align-start'>Index</span>
            <span className='w-40'>Registration Number</span>
            {/* <span className='hidden 2xl:block'>Depot</span> */}
            <span>Passenger Insurance</span>
            <span>Vehicle License</span>
            <span>Vehicle Insurance</span>
            <span className='w-40'>Certificate Of Fitness</span>
            <span className='extra-pad'>Route Authority</span>
          </div>
          <div className='body'>
            {buses?.map((bus, index) => (
              <div key={bus.id} onClick={() => handleShowBus(bus.regNumber)} className={classNames(index % 2 === 0 ? "bg-purple-50 tr" : "bg-gray-200 tr", "cursor-pointer duration-100 hover:bg-green-100")}>
                <span className='align-start'>{index+1}</span>
                <span className='align-start w-40'>{bus.regNumber}</span>
                {/* <span className='hidden 2xl:block capitalize'>{bus.depot}</span> */}
                <span>{moment(bus.passengerInsurance).format("DD MMMM YYYY")}</span>
                <span>{moment(bus.vehicleLicence).format("DD MMMM YYYY")}</span>
                <span>{moment(bus.vehicleInsurance).format("DD MMMM YYYY")}</span>
                <span className='w-40'>{moment(bus.certificateOfFitness).format("DD MMMM YYYY")}</span>
                <span className='extra-pad'>{moment(bus.routeAuthority).format("DD MMMM YYYY")}</span>
              </div>
            ))}
            <div className='bg-gray-200 w-full rounded-b px-7 p-3 flex justify-center'>
              <div className='text-gray-50 flex gap-7'>
                {/* <button className='page-btn'>first</button> */}
                <button className='page-btn'><LuChevronsLeft fontSize={20}/></button>
                <button className='page-btn'>1</button>
                <button className='page-btn'><MdKeyboardDoubleArrowRight fontSize={20}/></button>
                {/* <button className='page-btn'>last</button> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShowBus show={showBus} setShowBus={setShowBus} regNumber={regNumber} />
    </div>
  );
};