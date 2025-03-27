import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { FetchSource } from './FetchSource';

export const ItemsOptions = () => {
  const url = FetchSource().source;

  const { data: items = []} = useQuery({
    queryFn: () => fetch(`${url}/items`).then(res => res.json()),
    queryKey: ["items"],
  });

  const options = (items) => {
    return items.map(item => ({
      label: item.name,
      value: item.id,
    }));
  };

  const completeOptions = [{ label: "--All--", value: "" }, ...options(items)];

  
  return {options:completeOptions}
}