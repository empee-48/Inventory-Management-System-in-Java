import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { FetchSource, getFetch } from '../utilities/FetchSource';
import { Loader } from "../utilities/Loader";
import { ShowDriver } from './ShowDriver';
import { LuChevronsLeft } from 'react-icons/lu';
import { MdKeyboardDoubleArrowRight } from 'react-icons/md';
import classNames from 'classnames';
import moment from 'moment';
import { useGlobalContext } from '../utilities/GlobalContext';
import Select from 'react-select';
import "../permits/Permits.css";

export const Drivers = () => {
  const [showDriver, setShowDriver] = useState(false);
  const [driverId, setDriverId] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [depotOptions, setDepotOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);
  const [selectedDepot, setSelectedDepot] = useState("");
  const [selectedDriver, setSelectedDriver] = useState("");
  const [isDownloading, setIsDownloading] = useState(false);
  const itemsPerPage = 15;

  const { setErrorModal, setModalMessage } = useGlobalContext();

  const fetchDrivers = async () => {
    const tempListDepot = [{ value: "", label: "All Depots" }];
    const tempListDrivers = [{ value: "", label: "All Drivers" }];
    const data = await getFetch("drivers");

    data.forEach(driver => {
      if (!tempListDepot.some(option => option.value === driver.depot)) {
        tempListDepot.push({ value: driver.depot, label: driver.depot });
      }
      
      tempListDrivers.push({ 
        value: driver.id, 
        label: `${driver.id} - ${driver.firstName} ${driver.lastName}`
      });
    });

    setDepotOptions(tempListDepot);
    setDriverOptions(tempListDrivers);
    return data;
  };

  const fetchFilteredDrivers = async () => {
    const params = new URLSearchParams();
    if (selectedDepot) params.append('depot', selectedDepot);
    if (selectedDriver) params.append('driverId', selectedDriver);
    
    return await getFetch(`drivers?${params.toString()}`);
  };

  const { data: drivers, isLoading } = useQuery({
    queryFn: fetchDrivers,
    queryKey: ["drivers"]
  });

  const { data: filteredDrivers = [], refetch } = useQuery({
    queryFn: fetchFilteredDrivers,
    queryKey: ["filteredDrivers", selectedDepot, selectedDriver],
    enabled: !!drivers
  });

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const params = new URLSearchParams();
      if (selectedDepot) params.append('depot', selectedDepot);
      if (selectedDriver) params.append('driverId', selectedDriver);
      params.append('download', 'true');
      
      const response = await fetch(`${FetchSource().source}drivers?${params.toString()}`);
      
      if (!response.ok) throw new Error('Failed to download');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `drivers_${new Date().toISOString().split('T')[0]}.xlsx`);
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

  // Pagination logic
  const totalPages = Math.ceil(filteredDrivers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredDrivers.slice(indexOfFirstItem, indexOfLastItem);

  const handleShowDriver = (id) => {
    setShowDriver(true);
    setDriverId(id);
  };

  const handleDepotFilter = (depot) => {
    setSelectedDepot(depot);
    setCurrentPage(1);
  };

  const handleDriverFilter = (driverId) => {
    setSelectedDriver(driverId);
    setCurrentPage(1);
  };

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div>
      <div className='mx-auto w-full px-10'>
        <div className='bg-gradient-to-tl mb-2 rounded p-1 from-purple-600 to-purple-800 px-10 border-2 border-purple-600'>
          <div className='flex justify-between items-center border-gray-300 border-b mb-2 p-1'>
            <h1 className='text-3xl text-gray-200'>Filters</h1>
            <button 
              onClick={handleDownload}
              disabled={isDownloading || filteredDrivers.length === 0}
              className={`bg-gradient-to-br from-green-600 to-green-800 text-white px-4 py-2 rounded-md shadow hover:from-green-700 hover:to-green-900 transition-colors duration-300 ${
                isDownloading || filteredDrivers.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isDownloading ? 'Downloading...' : 'Download Excel'}
            </button>
          </div>
          <div className='flex gap-10 mb-2 justify-between'>
            <Select
              className='w-72 mb-1 capitalize'
              placeholder="Filter depots..."
              options={depotOptions}
              onChange={(selectedOption) => handleDepotFilter(selectedOption.value)}
              value={depotOptions.find(option => option.value === selectedDepot)}
            />
            <Select
              className='w-72 mb-1'
              placeholder="Filter drivers..."
              options={driverOptions}
              onChange={(selectedOption) => handleDriverFilter(selectedOption.value)}
              value={driverOptions.find(option => option.value === selectedDriver)}
            />
          </div>
        </div>
        <div className='shadow-2xl shadow-gray-400'>
          <div className='head tr-driver'>
            <span className='align-start'>Driver ID</span>
            <span>Driver Name</span>
            <span>Driver Phone</span>
            <span>Depot</span>
            <span>Medical</span>
            <span>Retest</span>
            <span className='extra-pad'>Defensive</span>
          </div>
          <div className='body'>
            {currentItems.map((driver, index) => (
              <div 
                key={driver.id} 
                onClick={() => handleShowDriver(driver.id)} 
                className={classNames(
                  index % 2 === 0 ? "bg-purple-50 tr-driver" : "bg-gray-200 tr-driver", 
                  "cursor-pointer duration-100 hover:bg-gray-300 tbody"
                )}
              >
                <span className='align-start'>{(currentPage - 1) * itemsPerPage + index + 1}. {driver.id}</span>
                <span className='capitalize'>{driver.firstName} {driver.lastName}</span>
                <span>{driver.phone}</span>
                <span className='capitalize'>{driver.depot}</span>
                <span>{moment(driver.medical).format("DD MMMM YYYY")}</span>
                <span>{moment(driver.retest).format("DD MMMM YYYY")}</span>
                <span className='extra-pad'>{moment(driver.defensive).format("DD MMMM YYYY")}</span>
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
      <ShowDriver show={showDriver} setShowDriver={setShowDriver} driverId={driverId} />
    </div>
  );
};