import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { DriversNav } from './DriversNav'
import { AddDriver } from './AddDriver'

export const DriversPage = () => {
  const [AddNew, setAddDriver] = useState(false)
  const handleAddClick = () => console.log("Adding Something New")
  return (
    <>
        <DriversNav toAdd={()=> setAddDriver(true)}/>
        <Outlet />
        <AddDriver show={AddNew} setAddDriver={setAddDriver}/>
    </>
  )
}
