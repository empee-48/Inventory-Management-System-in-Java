import React from 'react'
import { MySideBar } from './MySideBar'
import { ItemsPage } from '../items/ItemsPage'
import { createBrowserRouter,RouterProvider } from 'react-router-dom'
import { RestockPage } from '../restock/RestockPage'
import { DashboardPage } from '../dashboard/DashboardPage'
import { WithdrawalsPage } from '../withdrawal/WithdrawalsPage'
import { ReportsPage } from '../report/ReportsPage'

const Layout=({children})=>{
  return (
  <div className='flex'>
          <MySideBar />
          <div className='w-full'>
            {children}
          </div>
    </div>
  )
}

const router=createBrowserRouter([
  
  {
    path:"/",
    element: <Layout><DashboardPage /></Layout>
  },
  {
    path:"/items",
    element: <Layout><ItemsPage /></Layout>
  },
  {
    path:"/restocks",
    element: <Layout> <RestockPage /> </Layout>
  },
  {
    path:"/withdrawals",
    element: <Layout> <WithdrawalsPage /> </Layout>
  },
  {
    path:"/reports",
    element: <Layout> <ReportsPage /> </Layout>
  }

])

export const AppRouter = () => {
  return (
    <RouterProvider router={router}/>
  )
}
