import React from 'react'
import { MySideBar } from './MySideBar'
import { ItemsPage } from '../inventory/items/ItemsPage'
import { createBrowserRouter,RouterProvider, Outlet } from 'react-router-dom'
import { RestockPage } from '../inventory/restock/RestockPage'
import { DashboardPage } from '../dashboard/DashboardPage'
import { WithdrawalsPage } from '../inventory/withdrawal/WithdrawalsPage'
import { ReportsPage } from '../inventory/report/ReportsPage'
import { Permits } from '../permits/Permits'
import { PermitsNav } from '../permits/PermitsNav'
import { DriversPage } from '../drivers/DriversPage'
import { DriversDocs } from '../drivers/DriversDocs'
import { Drivers } from '../drivers/Drivers'
import {Success} from '../utilities/Success';
import {Error} from '../utilities/Error'
import { useGlobalContext } from '../utilities/GlobalContext'
import { PermitsDocs } from '../permits/PermitsDocs'

const Layout=()=>{
  const {errorModal, successModal, clarityModal} = useGlobalContext()
  return (
  <div className='flex'>
          <MySideBar />
          <div className='unside-bar'>
            { successModal && <Success /> }
            { errorModal && <Error /> }
            { clarityModal && <Clarity /> }
            <Outlet />
          </div>
    </div>
  )
}

const router=createBrowserRouter([
  
  {
    path:"/",
    element: <Layout />,
    children: [
      {
        path: "",
        element: <DashboardPage />
      },
      {
        path:"/items",
        element: <ItemsPage />
      },
      {
        path:"/restocks",
        element: <RestockPage />
      },
      {
        path:"/withdrawals",
        element: <WithdrawalsPage />
      },
      {
        path:"/reports",
        element: <ReportsPage />
      },
      {
        path: "/permits",
        element: <PermitsNav />,
        children: [
          {
            path: "/permits",
            element: <Permits />
          },
          {
            path: "/permits/documents",
            element: <PermitsDocs />
          }
        ]
      },
      {
        path: "/drivers",
        element: <DriversPage />,
        children: [
          {
            path: "/drivers",
            element: <Drivers />
          },{
            path: "/drivers/documents",
            element: <DriversDocs />
          }
        ]
      }
    ]
  }
])

export const AppRouter = () => {
  return (
    <RouterProvider router={router}/>
  )
}
