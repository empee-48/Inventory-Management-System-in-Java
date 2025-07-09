import React, { useState } from 'react';
import './Permits.css';
import { useQuery } from '@tanstack/react-query';
import { FetchSource, getFetch } from '../utilities/FetchSource';
import { Loader } from '../utilities/Loader';
import { equalsIgnoreCase } from '../utilities/EqualsIgnoreCase';
import moment from 'moment';
import Select from 'react-select';
import classNames from 'classnames';
import { ShowBus } from './showBus';
import { LuChevronsLeft } from "react-icons/lu";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";
import { useGlobalContext } from '../utilities/GlobalContext';

export const Permits = () => {
  const [showBus, setShowBus] = useState(false);
  const [regNumber, setRegNumber] = useState();
  const [busOptions, setBusOptions] = useState([]);
  const [depotOptions, setDepotOptions] = useState([]);
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [permitStatusFilter, setPermitStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedDepot, setSelectedDepot] = useState("All");
  const itemsPerPage = 15;

  const { setErrorModal, setModalMessage } = useGlobalContext();

  const fetchPermits = async () => {
    const tempListBuses = [];
    const tempListDepot = [{ value: "All", label: "--All--" }];

    const data = await getFetch("buses");

    data.forEach(bus => {
      const regNumber = bus.regNumber;
      const depot = bus.depot;

      tempListBuses.push({ value: regNumber, label: regNumber });
      if (!tempListDepot.some(option => option.value === depot)) {
        tempListDepot.push({ value: depot, label: depot });
      }
    });

    setBusOptions(tempListBuses);
    setDepotOptions(tempListDepot);
    setBuses(data);
    setFilteredBuses(data);
    return data;
  };

  const { isLoading, error, refetch } = useQuery({
    queryKey: ["busPermits"],
    queryFn: fetchPermits
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredBuses.slice(indexOfFirstItem, indexOfLastItem);

  const handleShowBus = regNumber => {
    setRegNumber(regNumber);
    setShowBus(true);
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const params = new URLSearchParams();
      
      if (selectedDepot !== "All") params.append('depot', selectedDepot);
      params.append('download', 'true');
      
      const response = await fetch(`${FetchSource().source}buses?${params.toString()}`);
      
      if (!response.ok) throw new Error('Failed to download');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `bus_permits_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Download error:', error);
      setModalMessage('Failed to download Excel file');
      setErrorModal(true);
    } finally {
      setIsDownloading(false);
    }
  };

  const handleDepotParam = depot => {
    let filtered = rawBuses;
    
    if (depot !== "All") {
      filtered = filtered.filter(bus => equalsIgnoreCase(bus.depot, depot));
    }
    
    if (permitStatusFilter !== "All") {
      filtered = filtered.filter(bus => bus.status === permitStatusFilter);
    }
    
    setFilteredBuses(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    setModalMessage(error.message);
    setErrorModal(true);
    return <div></div>;
  }

  return (
    <>
      <div className='mx-5'>
        <div className='w-full'>
          <div className='bg-gradient-to-tl mb-2 rounded p-1 from-purple-600 to-purple-900 px-10 border-2 border-purple-600'>
            <div className='flex justify-between items-center border-gray-300 border-b mb-2 p-1'>
              <h1 className='text-3xl text-gray-200'>Filters</h1>
              <button 
                  onClick={handleDownload}
                  disabled={isDownloading || filteredBuses.length === 0}
                  className={`bg-gradient-to-br from-green-600 to-green-800 text-white px-4 py-2 rounded-md shadow hover:from-green-700 hover:to-green-900 transition-colors duration-300 ${
                    isDownloading || filteredBuses.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isDownloading ? 'Downloading...' : 'Download Excel'}
                </button>
            </div>
            <div className='flex mb-2 justify-between'>
              <Select
                className='w-72 mb-1 capitalize'
                placeholder="Filter depots..."
                options={depotOptions}
                onChange={(selectedOption) => handleDepotParam(selectedOption.value)}
              />
              <Select
                className='w-72 mb-1'
                placeholder="Filter buses..."
                options={busOptions}
                onChange={(selectedOption) => handleShowBus(selectedOption.value)}
              />
            </div>
          </div>
          <div className='car-table shadow-2xl shadow-gray-400'>
            <div className='head tr'>
              <span className='w-40'>Registration Number</span>
              <span className='hidden 2xl:block'>Depot</span>
              <span>Passenger Insurance</span>
              <span>Vehicle License</span>
              <span>Vehicle Insurance</span>
              <span className='w-40'>Certificate Of Fitness</span>
              <span className='extra-pad'>Route Authority</span>
            </div>
            <div className='body'>
              {currentItems.map((bus, index) => (
                <div 
                  key={bus.id} 
                  onClick={() => handleShowBus(bus.regNumber)} 
                  className={classNames(
                    index % 2 === 0 ? "bg-purple-50 tr" : "bg-gray-200 tr", 
                    "cursor-pointer duration-100 hover:bg-gray-300"
                  )}
                >
                  <span className='align-start w-40'> 
                    <span>{(currentPage - 1) * itemsPerPage + index + 1}.</span> {bus.regNumber}
                  </span>
                  <span className='hidden 2xl:block capitalize'>{bus.depot}</span>
                  <span>{moment(bus.passengerInsurance).format("DD MMMM YYYY")}</span>
                  <span>{moment(bus.vehicleLicence).format("DD MMMM YYYY")}</span>
                  <span>{moment(bus.vehicleInsurance).format("DD MMMM YYYY")}</span>
                  <span className='w-40'>{moment(bus.certificateOfFitness).format("DD MMMM YYYY")}</span>
                  <span className='extra-pad'>{moment(bus.routeAuthority).format("DD MMMM YYYY")}</span>
                </div>
              ))}
              <div className='bg-gray-200 w-full rounded-b px-7 p-3 border-t-2 border-gray-300 flex justify-center'>
                <div className='text-gray-50 flex gap-7 items-center'>
                  <button 
                    className='page-btn' 
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                  >
                    First
                  </button>
                  <button 
                    className='page-btn flex items-center'
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <LuChevronsLeft fontSize={20}/>
                  </button>
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        className={`page-btn ${currentPage === pageNum ? 'bg-gray-400' : ''}`}
                        onClick={() => paginate(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  <button 
                    className='page-btn flex items-center'
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <MdKeyboardDoubleArrowRight fontSize={20}/>
                  </button>
                  <button 
                    className='page-btn'
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                  >
                    Last
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ShowBus show={showBus} setShowBus={setShowBus} regNumber={regNumber} refetch={refetch}/>
    </>
  );
};