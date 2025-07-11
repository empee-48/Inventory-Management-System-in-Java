import React, { useEffect, useState } from 'react'
import { FetchSource, getFetch } from '../utilities/FetchSource'
import { useQuery } from '@tanstack/react-query'
import { Checkbox, FormControlLabel } from '@mui/material'
import moment from 'moment'
import Select from 'react-select'
import { UpdateDocument } from './UpdateDocument'

export const DriversDocs = () => {
  // Filter states
  const [expired, setExpired] = useState(true);
  const [expiring, setExpiring] = useState(true);
  const [valid, setValid] = useState(true);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [showUpdateDocument, setShowUpdate] = useState(false);
  const [driverName, setDriverName] = useState();
  const [driverId, setDriverId] = useState();
  const [docType, setDocType] = useState();
  const [isDownloading, setIsDownloading] = useState(false);
  const {source: baseUrl} = FetchSource()

  // Filter options
  const [depotOptions, setDepotOptions] = useState([]);
  const [driverOptions, setDriverOptions] = useState([]);

  const handleShowUpdate = (driverId, driverName, docType) => {
    setShowUpdate(true);
    setDriverName(driverName);
    setDriverId(driverId);
    setDocType(docType);
  }

  // Fetch filter options (depots and drivers)
  const fetchFilterData = async () => {
    try {
      const tempListDrivers = [{ value: null, label: "All Drivers" }];
      const tempListDepot = [{ value: null, label: "All Depots" }];
  
      const data = await getFetch("drivers");
  
      data.forEach(driver => {
        tempListDrivers.push({ 
          value: driver.id, 
          label: `${driver.id} - ${driver.firstName} ${driver.lastName}`
        });
        
        if (!tempListDepot.some(option => option.value === driver.depot)) {
          tempListDepot.push({ 
            value: driver.depot, 
            label: driver.depot 
          });
        }
      });
  
      setDriverOptions(tempListDrivers);
      setDepotOptions(tempListDepot);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  // Handle Excel download
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const params = new URLSearchParams();
      
      params.append('expired', expired ? '1' : '0');
      params.append('expiring', expiring ? '1' : '0');
      params.append('valid', valid ? '1' : '0');
      params.append('download', 'true');
      
      if (selectedDepot) params.append('depot', selectedDepot);
      if (selectedDriver) params.append('driverId', selectedDriver);
      
      // Use fetch directly for better blob handling
      const response = await fetch(`${baseUrl}drivers/docs?${params.toString()}`, {
        headers: {
          'Content-Type': 'application/json',
          // Add authorization headers if needed
          // 'Authorization': `Bearer ${token}`
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const blob = await response.blob();
      
      // Check if the blob has content
      if (blob.size === 0) {
        throw new Error('Empty file received');
      }
  
      // Create proper download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `driver_documents_${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (error) {
      console.error('Download failed:', error);
      alert(`Download failed: ${error.message}`);
    } finally {
      setIsDownloading(false);
    }
  };

  // Fetch driver documents with all filters
  const { data: driverDocs, isLoading, error } = useQuery({
    queryKey: ["driverDocs", { expired, expiring, valid, selectedDepot, selectedDriver }],
    queryFn: () => {
      const params = new URLSearchParams();
      
      params.append('expired', expired ? '1' : '0');
      params.append('expiring', expiring ? '1' : '0');
      params.append('valid', valid ? '1' : '0');
      
      if (selectedDepot) params.append('depot', selectedDepot);
      if (selectedDriver) params.append('driverId', selectedDriver);
      
      return getFetch(`drivers/docs?${params.toString()}`);
    },
    keepPreviousData: true
  });

  // Handler for checkbox changes
  const handleFilterChange = (filterName) => (event) => {
    const isChecked = event.target.checked;
    switch(filterName) {
      case 'expired': setExpired(isChecked); break;
      case 'expiring': setExpiring(isChecked); break;
      case 'valid': setValid(isChecked); break;
    }
  };

  // Handler for depot selection
  const handleDepotChange = (selectedOption) => {
    setSelectedDepot(selectedOption.value);
  };

  // Handler for driver selection
  const handleDriverChange = (selectedOption) => {
    setSelectedDriver(selectedOption.value);
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  if (isLoading) return <div className="px-10 py-5 text-gray-200">Loading drivers...</div>;
  if (error) return <div className="px-10 py-5 text-red-300">Error loading drivers: {error.message}</div>;

  return (
    <>
      <div className='px-10 pb-10'>
        <div className='bg-gradient-to-tl mb-2 rounded p-1 from-purple-900 to-purple-600 px-10 border-2 border-purple-600'>
          <div className='flex justify-between items-center border-gray-300 border-b mb-2 p-1'>
            <h1 className='text-3xl text-gray-200'>Filters</h1>
            <button 
              onClick={handleDownload}
              disabled={isDownloading || !driverDocs?.length}
              className={`bg-gradient-to-br from-green-600 to-green-800 text-white px-4 py-2 rounded-md shadow hover:from-green-700 hover:to-green-900 transition-colors duration-300 ${
                isDownloading || !driverDocs?.length ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isDownloading ? 'Downloading...' : 'Download Excel'}
            </button>
          </div>
          
          <div className='grid mb-2'>
            {/* Dropdown Filters */}
            <div className='flex mb-2 justify-between'>
              <Select
                className='w-72 mb-1 capitalize text-black'
                placeholder="Filter depots..."
                options={depotOptions}
                onChange={handleDepotChange}
                value={depotOptions.find(option => option.value === selectedDepot)}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: 'white',
                    borderRadius: '4px',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999
                  })
                }}
              />
              
              <Select
                className='w-72 mb-1 text-black'
                placeholder="Filter drivers..."
                options={driverOptions}
                onChange={handleDriverChange}
                value={driverOptions.find(option => option.value === selectedDriver)}
                styles={{
                  control: (provided) => ({
                    ...provided,
                    backgroundColor: 'white',
                    borderRadius: '4px',
                  }),
                  menu: (provided) => ({
                    ...provided,
                    zIndex: 9999
                  })
                }}
              />
            </div>

            {/* Checkbox Filters */}
            <div className='flex justify-evenly rounded bg-emerald-700 border w-full p-2'>
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={valid}
                    onChange={handleFilterChange('valid')}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: 'white' },
                    }}
                  />
                }
                label="Valid"
                labelPlacement="end"
                sx={{ color: 'white', fontWeight: 'medium' }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={expiring}
                    onChange={handleFilterChange('expiring')}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: 'white' },
                    }}
                  />
                }
                label="Almost Expired"
                labelPlacement="end"
                sx={{ color: 'white', fontWeight: 'medium' }}
              />
              
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={expired}
                    onChange={handleFilterChange('expired')}
                    sx={{
                      color: 'white',
                      '&.Mui-checked': { color: 'white' },
                    }}
                  />
                }
                label="Expired"
                labelPlacement="end"
                sx={{ color: 'white', fontWeight: 'medium' }}
              />
            </div>
          </div>
        </div>
        
        {/* Results Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {driverDocs?.length > 0 ? (
            driverDocs.map((driverDoc, index) => (
              <div key={index} className='px-5 font-medium bg-gradient-to-br text-gray-200 from-purple-900 to-gray-400 rounded border border-gray-300 shadow-xl shadow-gray-400'>
                <p className='flex justify-evenly border-b-2 border-gray-300 py-1 capitalize'>
                  <span>{driverDoc.driverId}</span> <span>{driverDoc.driverName}</span>
                </p>
                <p className='capitalize'>Depot: {driverDoc.depot}</p>
                <p>Type: {driverDoc.type}</p>
                <p>Expires: {moment(driverDoc.expirationDate).format("DD MMMM, YYYY")}</p>
                <p className='flex justify-end p-1 py-3'>
                  <button 
                    className='bg-gradient-to-br from-amber-700 to-amber-500 shadow-lg w-32 font-medium text-gray-300 rounded h-8 hover:to-amber-600 duration-300 transition-colors'
                    onClick={() => handleShowUpdate(driverDoc.driverId, driverDoc.driverName, driverDoc.type)}
                  >
                    Update
                  </button>
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-400">
              No drivers found matching the selected filters
            </div>
          )}
        </div>
      </div>
      <UpdateDocument 
        driverId={driverId} 
        driverName={driverName} 
        show={showUpdateDocument} 
        setShowUpdate={setShowUpdate} 
        docType={docType}
      />
    </>
  )
}