import React from 'react';
import { useForm } from 'react-hook-form';
import { FetchSource } from '../utilities/FetchSource';

export const AddItem = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const url=FetchSource().source;
  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${url}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      // Handle success (e.g., show a message or reset the form)
      alert('Item added successfully!');
    } catch (error) {
      // Handle error (e.g., show an error message)
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div className='add-item-form'>
      <h1 className='font-bold bg-purple-500 mb-4 text-center py-3 rounded-t-lg text-gray-200 text-2xl'>Add Item</h1>
      <form className='grid' onSubmit={handleSubmit(onSubmit)}>
        <p className='form-p'>
          <label htmlFor="serial">Serial Number </label>
          <input 
            type="text" 
            {...register('serialNumber', { required: true })} 
            className='form-input' 
          />
          {errors.serial && <span className='text-red-500'>This field is required</span>}
        </p>
        <p className='form-p'>
          <label htmlFor="name">Name </label>
          <input
            type="text" 
            {...register('name', { required: true })} 
            className='form-input' 
          />
          {errors.name && <span className='text-red-500'>This field is required</span>}
        </p>
        <p className='form-p'>
          <label htmlFor="instock">Instock </label>
          <input 
            type="number" 
            {...register('instock', { required: true, min: 0 })} 
            className='form-input' 
          />
          {errors.instock && <span className='text-red-500'>This field is required and must be at least 0</span>}
        </p>
        <p className='form-p'>
          <label htmlFor="unit">Unit </label>
          <input 
            type="text" 
            {...register('unit')} // No required validation
            className='form-input' 
          />
        </p>
        <p className="m-2 grid justify-end px-20">
          <input type="submit" value="Add Item" className='bg-cyan-500 px-5 py-2 rounded-lg text-gray-100 cursor-pointer' />
        </p>
      </form>
    </div>
  );
};