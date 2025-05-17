import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AddPermit } from './AddPermit'

export const PermitsNav = () => {
  const [addBus, setAddBus] = useState(false)

  return (
    <div>
      <div className='bg-gray-100 shadow-lg w-full flex p-3 justify-between px-10 mb-4'>
          <h3 className='text-gray-800 font-semibold text-3xl'>Bus Permits</h3>
          <button onClick={()=>setAddBus(true)} className='font-semibold hover:bg-gray-900 hover:shadow-2xl duration-200 hover:text-gray-300 bg-gray-700 text-gray-100 p-2 px-8 rounded' title='Click to go to the add item page'>Create New</button>
      </div>
      <Outlet />
      <AddPermit show={addBus} setAddBus = {setAddBus}/>
    </div>
  )
}
