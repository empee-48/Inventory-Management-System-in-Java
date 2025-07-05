import React, { useState } from 'react';
import classNames from 'classnames';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { TextField, Button } from '@mui/material';
import { postFetch } from '../utilities/FetchSource';
import { useGlobalContext } from '../utilities/GlobalContext';

export const UpdateDocument = ({ show, setShowUpdate, driverId, driverName, docType }) => {
  const [expirationDate, setExpirationDate] = useState(null);
  const {setErrorModal, setModalMessage, setSuccessModal} = useGlobalContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    postFetch("drivers/docs/update",{driverId:driverId,type:docType,expirationDate:expirationDate,depot: ""})
    .then(data=>{
        setModalMessage("Update Completed Successfully!!!");
        setSuccessModal(true);
        setTimeout(window.location.reload(),1500);
    })
    .catch(err=>{setModalMessage(err.message);setErrorModal(true)})
    setShowUpdate(false);
  };

  return (
    <div className={classNames(show ? 'modal-container duration-200' : 'modal-hidden')}>
      <div className='w-96 bg-gray-50 my-40 mx-auto rounded'>
        <h1 className='text-gray-700 font-semibold text-xl px-5 capitalize flex justify-between py-2 border-b border-gray-400'>
         <span>{driverId}</span> <span>{driverName}</span> <span>{docType}</span>
        </h1>
        
        <div className='w-full py-5 p-2 grid justify-center'>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <form onSubmit={handleSubmit} className='w-full'>
                <DatePicker
                  label="New Expiration Date"
                  value={expirationDate}
                  onChange={(newValue) => setExpirationDate(newValue)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      fullWidth 
                      required
                    />
                  )}
                  minDate={new Date()}
                />
              <div className='flex justify-evenly gap-3 mt-6'>
                <button className='w-40 bg-gradient-to-br from-amber-700 to-amber-500 text-gray-800 rounded h-8 font-medium' type='submit'>Update</button>
                <button className='w-40 bg-gradient-to-br from-gray-900 to-gray-400 rounded h-8 font-medium text-gray-50' type='button' onClick={()=>setShowUpdate(false)}>Close</button>
              </div>
            </form>
          </LocalizationProvider>
        </div>
      </div>
    </div>
  );
};