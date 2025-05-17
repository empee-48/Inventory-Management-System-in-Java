import React from 'react'

export const ErrorOutput = ({message}) => {
  return (
    <div className='font-semibold text-3xl text-gray-700'>Error - {message}</div>
  )
}
