import React from 'react';
import { useForm } from 'react-hook-form';
import { FetchSource, postFetch } from '../utilities/FetchSource';
import classNames from 'classnames';
import {useGlobalContext} from "../utilities/GlobalContext"
import { replace, useNavigate } from 'react-router-dom';

export const AddDriver = ({setAddDriver,show}) => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const {setErrorModal, setModalMessage, setSuccessModal } = useGlobalContext()
  const navigate = useNavigate()

  const onSubmit = async (data) => {
    postFetch("drivers",data)
    .then(data => {
      setModalMessage("Driver Added Successfully!!!");
      setSuccessModal(true);
      setAddDriver(false);
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
      <h1 className='font-bold bg-purple-800 text-center py-3 rounded-t text-gray-100 text-3xl'>Add New Driver </h1>
      
      <form className='grid bg-gray-800 font-medium' onSubmit={handleSubmit(onSubmit)}>
        <p className='form-p'>
          <label htmlFor="serial">First Name</label>
          <input autoComplete='off'
            type="text" 
            {...register('firstName', { required: true })} 
            className='form-input ' 
          />
          {errors.firstName && <span className='text-rose-400 text-sm font-bold'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="lastName">Last Name</label>
          <input 
            type="text" 
            {...register('lastName', { required: true})} 
            className=' form-input outline-none' 
          />
          {errors.lastName && <span className='text-rose-400 text-sm font-bold'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="name">Depot </label>
          <input autoComplete='off'
            type="text" 
            {...register('depot', { required: true })} 
            className='form-input '
          />
          {errors.depot && <span className='text-rose-400 text-sm font-bold'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="phone">Phone </label>
          <input autoComplete='off'
            type="text" 
            {...register('phone', { required: true })} 
            className='form-input '
          />
          {errors.phone && <span className='text-rose-400 text-sm font-bold'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="medical">Medical</label>
          <input 
            type="date" 
            {...register('medical', { required: true})} 
            className=' form-input outline-none' 
          />
          {errors.medical && <span className='text-rose-400 text-sm font-bold'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="retest"> Retest </label>
          <input 
            type="date" 
            {...register('retest', { required: true})} 
            className=' form-input outline-none' 
          />
          {errors.retest && <span className='text-rose-400 text-sm font-bold'>This field is required</span>}
        </p>
        <p className='form-p '>
          <label htmlFor="defensive">Defensive</label>
          <input 
            type="date" 
            {...register('defensive', { required: true})} 
            className=' form-input outline-none' 
          />
          {!!errors.defensive && <span className='text-rose-400 text-sm font-bold'>This field is required</span>}
        </p>        
        <p className="m-2 mb-6 grid justify-between px-20 w-full grid-cols-2 gap-10">
          <button className='bg-green-600 w-full py-2 text-lg font-medium rounded-lg text-gray-100 cursor-pointer' type='button' onClick={()=>setAddDriver(false)}>Close</button>
          <input type="submit" value="Save Item" className='bg-green-600 font-medium rounded-lg text-lg text-gray-100 cursor-pointer' />
        </p>
      </form>
    </div>
    </div>
  );
};