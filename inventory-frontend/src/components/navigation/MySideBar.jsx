import React from 'react'
import { Sidebar,MenuItem,Menu,SubMenu } from 'react-pro-sidebar'
import { Link } from 'react-router-dom'

export const MySideBar = () => {
  return (
    <Sidebar className='sidebar'>
        <h1 className='header'>Inventory</h1>
        <Menu>
            <MenuItem className='menu-item'><Link to={"/"}><p className='w-full p-2 m-0'>Dashboard</p></Link></MenuItem>
            <MenuItem className='menu-item' ><Link to={"/items"}> <p className='w-full p-2 m-0'>Items</p> </Link></MenuItem>
            <MenuItem className='menu-item'><Link to={"/restocks"}> <p className='w-full p-2 m-0'>Restocks</p> </Link></MenuItem>
            <MenuItem className='menu-item'> <Link to={"/withdrawals"}> <p className='w-full p-2 m-0'> Withdrawals </p></Link> </MenuItem>
            <MenuItem className='menu-item'><Link to={"/reports"}> <p className='w-full p-2 m-0'> Reports </p></Link></MenuItem>
            <SubMenu label='Settings'>
              <MenuItem>Change Password</MenuItem>
              <MenuItem>Logout</MenuItem>
            </SubMenu>
        </Menu>
    </Sidebar>
  )
}
