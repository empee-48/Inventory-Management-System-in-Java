import React from 'react'

export const ReportItem = ({items}) => {

  return (
    <div className='report'>
        <div className="report-line bg-purple-500 font-semibold text-gray-100 rounded-t-lg">
            <span>Serial Number</span>
            <span>Item</span>
            <span>Opening Stock</span>
            <span>Closing Stock</span>
        </div>
        {items?.map(item=>(
            <div className={`report-line ${item.id%2==0?"bg-blue-200":"bg-blue-100"}`} key={item.id}>
                <span>{item.itemSerialNumber}</span>
                <span>{item.itemName}</span>
                <span>{item.openingStock}</span>
                <span>{item.closingStock}</span>
            </div>
        ))}
    </div>
  )
}
