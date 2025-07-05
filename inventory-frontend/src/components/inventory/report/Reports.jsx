import React, { useState } from 'react'
import moment from 'moment'
import { useQuery } from '@tanstack/react-query'
import { ReportItem } from './ReportItem'
import { FetchSource, getFetch } from '../../utilities/FetchSource'

export const Reports = () => {
  const url=FetchSource().source;
  const {data: reports,isLoading}=useQuery({
        queryFn:()=>getFetch("reports"),
        queryKey:["reports"]
    })
  
    const [openReport,setOpenReport]=useState(null)

    const fetchReport=(id)=>{
      fetch(`${url}/reports/${id}`)
        .then(res=>res.json()).then(data=>setOpenReport(data))
    }

    const downloadReport = async (report) => {
    try {
        const response = await fetch(`${url}reports/${report.id}/download`, {
            method: 'GET',
            responseType: 'blob' // Ensure response type is Blob
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `Inventory_Report${moment(report.createdAt).format('_DMMM,YYYY_HHmm')}hrs.xls`; // Specify the file name
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url); // Clean up
            alert('Download successful');
        } else {
            alert('Download failed');
        }
    } catch (error) {
        console.error('Error downloading report:', error);
        alert('Download failed');
    }
  }
  
    if(isLoading){
      return <div>Loading...</div>
    }

  return (
    <div className='flex'>
      <div className='w-fit report-sidebar min-w-72'>
        <h1 className='p-4 bg-purple-800 text-gray-100 font-bold text-2xl'>Reports</h1>
        {reports?.map(item=>(
            <div key={item.id} className='bg-gray-600 px-6 text-gray-100 py-1 border-b-2 border-gray-300'>
                <span className='col'>{item.reportType}</span>
                <span className="col">{moment(item.createdAt).format('D MMM, YYYY HH:mm')}</span>
                <span className='col'>
                <button className='report-details-btn' onClick={()=>{fetchReport(item.id)}}>{"Details>>"}</button>
                </span>
            </div>
        ))}
      </div>
      <div className='w-full mx-4 mt-4'>
        {openReport? <div>
        <ReportItem items={openReport.reportItems}/>
        <button className='bg-cyan-500 text-gray-100 m-4 px-5 py-2 font-semibold rounded-lg float-end' onClick={()=>downloadReport(openReport)}>Download</button> 
        <button className='bg-red-500 text-gray-100 m-4 px-5 py-2 font-semibold rounded-lg float-end' onClick={()=>setOpenReport(null)}>Close</button>
        </div> : <div className='font-semibold text-xl text-gray-400'>no report open</div> }
         
      </div>
    </div>

  )
}
