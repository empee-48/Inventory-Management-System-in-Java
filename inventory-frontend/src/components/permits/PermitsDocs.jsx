import React, { useEffect, useState } from 'react';
import { FetchSource, getFetch } from '../utilities/FetchSource';
import { useQuery } from '@tanstack/react-query';
import { Checkbox, FormControlLabel } from '@mui/material';
import moment from 'moment';
import Select from 'react-select';
import { UpdatePermit } from './UpdatePermit';

export const PermitsDocs = () => {
  const [expired, setExpired] = useState(true);
  const [expiring, setExpiring] = useState(true);
  const [valid, setValid] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [regNumber, setRegNumber] = useState(true);
  const [permitType, setPermitType] = useState(true);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  const [depotOptions, setDepotOptions] = useState([]);
  const [busOptions, setBusOptions] = useState([]);

  const { data: busDocs, isLoading, error } = useQuery({
    queryKey: ["busDocs", { expired, expiring, valid, selectedDepot, selectedBus }],
    queryFn: () => {
      const params = new URLSearchParams();
      
      params.append('expired', expired ? '1' : '0');
      params.append('expiring', expiring ? '1' : '0');
      params.append('valid', valid ? '1' : '0');
      
      if (selectedDepot) params.append('depot', selectedDepot);
      if (selectedBus) params.append('regNumber', selectedBus);
      
      return getFetch(`buses/permits?${params.toString()}`);
    },
    keepPreviousData: true
  });

  const handleShowPermit = (regNumber, permitType) => {
    setPermitType(permitType);
    setRegNumber(regNumber);
    setShowUpdate(true);
  };

  const fetchFilterData = async () => {
    try {
      const tempListBuses = [{ value: null, label: "All Buses" }];
      const tempListDepot = [{ value: null, label: "All Depots" }];
  
      const data = await getFetch("buses");
  
      data.forEach(bus => {
        tempListBuses.push({ 
          value: bus.regNumber, 
          label: bus.regNumber 
        });
        
        if (!tempListDepot.some(option => option.value === bus.depot)) {
          tempListDepot.push({ 
            value: bus.depot, 
            label: bus.depot 
          });
        }
      });
  
      setBusOptions(tempListBuses);
      setDepotOptions(tempListDepot);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const params = new URLSearchParams();
      
      params.append('expired', expired ? '1' : '0');
      params.append('expiring', expiring ? '1' : '0');
      params.append('valid', valid ? '1' : '0');
      params.append('download', 'true');
      
      if (selectedDepot) params.append('depot', selectedDepot);
      if (selectedBus) params.append('regNumber', selectedBus);
      
      const response = await fetch(`${FetchSource().source}buses/permits?${params.toString()}`);
      
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
    } finally {
      setIsDownloading(false);
    }
  };

  const handleFilterChange = (filterName) => (event) => {
    const isChecked = event.target.checked;
    switch(filterName) {
      case 'expired': setExpired(isChecked); break;
      case 'expiring': setExpiring(isChecked); break;
      case 'valid': setValid(isChecked); break;
    }
  };

  const handleDepotChange = (selectedOption) => {
    setSelectedDepot(selectedOption.value);
  };

  const handleBusChange = (selectedOption) => {
    setSelectedBus(selectedOption.value);
  };

  useEffect(() => {
    fetchFilterData();
  }, []);

  if (isLoading) return <div className="px-10 py-5 text-gray-200">Loading permits...</div>;
  if (error) return <div className="px-10 py-5 text-red-300">Error loading permits: {error.message}</div>;

  return (
    <>
      <div className='px-10 pb-10'>
        <div className='bg-gradient-to-tl mb-2 rounded p-1 from-purple-900 to-purple-600 px-10 border-2 border-purple-600'>
          <div className='flex justify-between items-center border-gray-300 border-b mb-2 p-1'>
            <h1 className='text-3xl text-gray-200'>Filters</h1>
            <button 
              onClick={handleDownload}
              disabled={isDownloading || !busDocs?.length}
              className={`bg-gradient-to-br from-emerald-600 to-emerald-800 text-white px-4 py-2 rounded-md shadow hover:from-green-700 hover:to-green-900 transition-colors duration-300 ${
                isDownloading || !busDocs?.length ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isDownloading ? 'Downloading...' : 'Download Excel'}
            </button>
          </div>
          
          <div className='grid mb-2'>
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
                placeholder="Filter buses..."
                options={busOptions}
                onChange={handleBusChange}
                value={busOptions.find(option => option.value === selectedBus)}
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
        
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'>
          {busDocs?.length > 0 ? (
            busDocs.map((busDoc, index) => (
              <div key={index} className='px-5 font-medium bg-gradient-to-br text-gray-200 from-purple-900 to-gray-400 rounded border border-gray-300 shadow-xl shadow-gray-400'>
                <p className='border-b-2 border-gray-300 text-gray-300 py-1 capitalize'>
                  <span>{busDoc.regNumber}</span>
                </p>
                <p className='capitalize'>{busDoc.depot}</p>
                <p>{busDoc.type}</p>
                <p>{moment(busDoc.expirationDate).format("DD MMMM, YYYY")}</p>
                <p className='flex justify-end p-1 py-3'>
                  <button className='bg-gradient-to-br from-amber-700 to-amber-500 shadow-lg w-32 font-medium duration-300 text-gray-300 rounded h-8 hover:to-amber-700 '
                  onClick={()=>handleShowPermit(busDoc.regNumber, busDoc.type)}
                  >
                    Update
                  </button>
                </p>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-10 text-gray-400">
              No permits found matching the selected filters
            </div>
          )}
        </div>
      </div>
      <UpdatePermit show={showUpdate} setShowUpdate={setShowUpdate} regNumber={regNumber} permitType={permitType} />
    </>
  );
};