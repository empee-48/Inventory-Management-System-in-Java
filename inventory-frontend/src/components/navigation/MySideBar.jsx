import React from 'react'
import { Sidebar,MenuItem,Menu,SubMenu } from 'react-pro-sidebar'
import { Link, useNavigate } from 'react-router-dom'

export const MySideBar = () => {
  const navigate = useNavigate()
  return (
    <Sidebar className='sidebar overflow-hidden'>
      <div className='bg-gray-800 py-1'>
        <h1 className='header shadow-xl shadow-black'>interafrica</h1>
      </div>
        <Menu className='bg-gray-800'>
            <MenuItem className='border-t-2 text-gray-100 font-medium border-gray-400' onClick={()=>navigate("/")}>Dashboard</MenuItem>
            {/* <SubMenu label='Inventory' className='sub-menu'>
              <MenuItem className='menu-item' onClick={()=>navigate("/items")}>Items</MenuItem>
              <MenuItem className='menu-item' onClick={()=>navigate("/restocks")} >Restocks</MenuItem>
              <MenuItem className='menu-item' onClick={()=>navigate("/withdrawals")}> Withdrawals</MenuItem>
              <MenuItem className='menu-item' onClick={()=>navigate("/reports")}>Reports</MenuItem>
            </SubMenu> */}
            <SubMenu label="Buses" className='sub-menu'>
              <MenuItem className='menu-item' onClick={()=>navigate("/permits")}>Buses</MenuItem>
              <MenuItem className='menu-item' onClick={()=>navigate("/permits/documents")}>Buses Documents</MenuItem>
            </SubMenu>
            <SubMenu label="Drivers" className='sub-menu'>
              <MenuItem className='menu-item' onClick={()=>navigate("/drivers")}>Drivers</MenuItem>
              <MenuItem className='menu-item' onClick={()=>navigate("/drivers/documents")}>Drivers Documents</MenuItem>
            </SubMenu>
            <SubMenu label='Settings' className='sub-menu'>
              <MenuItem className='menu-item'>Change Password</MenuItem>
              <MenuItem className='menu-item'>Logout</MenuItem>
            </SubMenu>
        </Menu>
    </Sidebar>
  )
}
