import React, { useEffect, useState } from 'react'
import { getFetch } from '../utilities/FetchSource'
import { useQuery } from '@tanstack/react-query'
import { Checkbox, FormControlLabel } from '@mui/material'
import moment from 'moment'
import Select from 'react-select'
import { UpdatePermit } from './UpdatePermit'

export const PermitsDocs = () => {
  const [expired, setExpired] = useState(true);
  const [expiring, setExpiring] = useState(true);
  const [valid, setValid] = useState(true);
  const [showUpdate, setShowUpdate] = useState(false);
  const [regNumber, setRegNumber] = useState(true);
  const [permitType, setPermitType] = useState(true);
  const [selectedDepot, setSelectedDepot] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  
  const [depotOptions, setDepotOptions] = useState([]);
  const [busOptions, setBusOptions] = useState([]);

  const handleShowPermit = (regNumber,permitType)=>{
    setPermitType(permitType);
    setRegNumber(regNumber);
    setShowUpdate(true);
  }

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

  // Fetch permit documents with all filters
  const { data: busDocs, isLoading, error } = useQuery({
    queryKey: ["busDocs", { expired, expiring, valid, selectedDepot, selectedBus }],
    queryFn: () => {
      const params = new URLSearchParams();
      
      // Always include these required parameters (must be 0 or 1)
      params.append('expired', expired ? '1' : '0');
      params.append('expiring', expiring ? '1' : '0');
      params.append('valid', valid ? '1' : '0');
      
      // Add optional depot filter if selected
      if (selectedDepot) params.append('depot', selectedDepot);
      
      // Add optional bus regNumber filter if selected
      if (selectedBus) params.append('regNumber', selectedBus);
      
      return getFetch(`buses/permits?${params.toString()}`);
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

  // Handler for bus selection
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
        <h1 className='text-3xl text-gray-200 border-b mb-2 border-gray-300'>Filters</h1>
        
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

          {/* Checkbox Filters - Now these are required but still toggleable */}
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
  )
}