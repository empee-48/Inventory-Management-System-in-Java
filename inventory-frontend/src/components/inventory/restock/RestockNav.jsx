import React from 'react'

export const RestockNav = ({toAdd}) => {
  return (
    <div className='bg-gray-100 shadow-lg w-full flex p-3 justify-between px-10 mb-10'>
        <h3 className='text-gray-800 font-semibold text-3xl'>Restock</h3>
        <button className='bg-gray-100 font-semibold text-gray-800' title='Click to go to the addr estock page' onClick={toAdd}>Add Stock</button>
    </div>
  )
}
