import React from 'react';
import { useForm } from 'react-hook-form';
import { FetchSource, postFetch } from '../utilities/FetchSource';
import classNames from 'classnames';
import {useGlobalContext} from "../utilities/GlobalContext"
import { replace, useNavigate } from 'react-router-dom';

export const AddPermit = ({setAddBus,show}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const {setErrorModal, setModalMessage, setSuccessModal } = useGlobalContext()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    postFetch("buses",data)
    .then(data => {
      setModalMessage("Bus Added Successfully!!!");
      setSuccessModal(true);
      setAddBus(false);
      reset();
      setTimeout(()=>{
        window.location.reload()
      },1500)
    })
    .catch(err=>{
      setErrorModal(true);
      setModalMessage(err.message)
    })
  };

  return (
    <div className={classNames(show? 'modal-container duration-200' : 'modal-hidden')}>
    <div className='add-item-form bg-gray-50 my-4 2xl:my-12 modal'>
      <h1 className='font-bold bg-purple-800 text-center py-3 rounded-t text-gray-100 text-3xl'>Add New Bus</h1>
      <form className='grid bg-gray-800 font-medium' onSubmit={handleSubmit(onSubmit)}>
        <p className='form-p'>
          <label htmlFor="serial">Registration Number</label>
          <input autoComplete='off'
            type="text" 
            {...register('regNumber', { required: true })} 
            className='form-input ' 
          />
          {errors.serial && <span className='text-red-500'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="name">Depot </label>
          <input autoComplete='off'
            type="text" 
            {...register('depot', { required: true })} 
            className='form-input '
          />
          {errors.name && <span className='text-red-500'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="passengerInsurance">Passenger Insurance </label>
          <input 
            type="date" 
            {...register('passengerInsurance', { required: true})} 
            className=' form-input outline-none' 
          />
          {errors.instock && <span className='text-red-500'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="vehicleLicense">Vehicle License </label>
          <input 
            type="date" 
            {...register('vehicleLicense', { required: true})} 
            className=' form-input outline-none' 
          />
          {errors.instock && <span className='text-red-500'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="vehicleInsurance"> Vehicle Insurance </label>
          <input 
            type="date" 
            {...register('vehicleInsurance', { required: true})} 
            className=' form-input outline-none' 
          />
          {errors.instock && <span className='text-red-500'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="certificateOfFitness"> Certificate of Fitness </label>
          <input 
            type="date" 
            {...register('certificateOfFitness', { required: true})} 
            className=' form-input outline-none' 
          />
          {errors.instock && <span className='text-red-500'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="routeAuthority">Route Authority</label>
          <input 
            type="date" 
            {...register('routeAuthority', { required: true})} 
            className=' form-input outline-none' 
          />
          {errors.instock && <span className='text-red-500'>This field is required</span>}
        </p>        
        <p className="m-2 mb-6 grid justify-between px-20 w-full grid-cols-2 gap-10">
          <button className='bg-green-600 w-full py-2 text-lg font-medium rounded-lg text-gray-100 cursor-pointer' onClick={()=>setAddBus(false)}>Close</button>
          <input type="submit" value="Save Item" className='bg-green-600 font-medium rounded-lg text-lg text-gray-100 cursor-pointer' />
        </p>
      </form>
    </div>
    </div>
  );
};