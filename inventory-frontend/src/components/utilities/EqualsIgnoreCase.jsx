import React from 'react'

export const EqualsIgnoreCase = () => {

  return (
    <div>EqualsIgnoreCase</div>
  )
}

export function equalsIgnoreCase(str1, str2) {
    return str1.toLowerCase() === str2.toLowerCase();
}