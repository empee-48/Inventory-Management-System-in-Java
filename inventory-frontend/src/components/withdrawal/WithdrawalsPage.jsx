import React, { useState } from 'react'
import { Withdrawals } from './Withdrawals'
import { WithdrawalsNav } from './WithdrawalsNav'
import { AddWithdrawal } from './AddWithdrawal'

export const WithdrawalsPage = () => {
  
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
        <WithdrawalsNav toAdd={toAdd}/>
        {add? <AddWithdrawal />: <Withdrawals />}
        { add &&
          <p className='grid justify-end mt-5' style={{width:"85%"}}>
            <button className='text-lg text-gray-600' onClick={toList} title='Click to return to the withdrawal list page'>{"<<Back to Withdrawals"}</button>
          </p>
        }
        
    </div>
  )
}
