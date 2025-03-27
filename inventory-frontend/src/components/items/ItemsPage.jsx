import React, { useState } from 'react'
import { Items } from './Items.jsx'
import { ItemNav } from './ItemNav.jsx'
import { AddItem } from './AddItem.jsx'

export const ItemsPage = () => {
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
        <ItemNav toAdd={toAdd}/>
        {add? <AddItem />: <Items /> }
        { add &&
          <p className='grid justify-end mt-5' style={{width:"85%"}}>
            <button className='text-lg text-gray-600' onClick={toList} title='Click to return to the items list page'>{"<<Back to Items"}</button>
          </p>
        }
    </div>
  )
}
