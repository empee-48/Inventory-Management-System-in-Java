import React from 'react'
import { RestockNav } from './RestockNav'
import { Restocks } from './Restocks'
import { AddRestock } from './AddRestock'
import { useState } from 'react'

export const RestockPage = () => {

  const [add,setAdd]=useState(localStorage.getItem("item")?true:false)
  
    const toAdd=()=>{
     localStorage.setItem("item",true)
     setAdd(true)
    }
    const toList=()=>{
      localStorage.removeItem("item")
      setAdd(false)
    }

  return (
    <div>
        <RestockNav toAdd={toAdd}/>
        {add? <AddRestock />: <Restocks />}
        { add &&
          <p className='grid justify-end mt-5' style={{width:"85%"}}>
            <button className='text-lg text-gray-600' onClick={toList} title='Click to return to the restock list page'>{"<<Back to Restocks"}</button>
          </p>
        }
    </div>
  )
}
