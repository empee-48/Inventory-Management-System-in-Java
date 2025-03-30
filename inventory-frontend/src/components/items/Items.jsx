import React,{ useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FetchSource } from '../utilities/FetchSource';
import { useSearchParams } from 'react-router-dom';

export const Items = () => {
  const queryClient = useQueryClient();
  
  const [searchParams,setSearchParams]=useSearchParams();
  const [items,setItems]=useState([]);
  const [search,setSearch]=useState()

  const url =FetchSource().source
  const { data: rawItems, isLoading} = useQuery({
    queryFn: () => fetch(`${url}/items`).then(res => res.json()),
    queryKey: ["rawItems"],
  });

  const addSearchParam=(name)=>{
    if(name){
      setSearchParams({"name":name})
      return;
    }
    searchParams.delete("name")
    setSearchParams(searchParams)
  }

  useEffect(()=>{
    setItems(searchParams.get("name")?rawItems.filter(item=>item.name.toLowerCase().includes(searchParams.get("name").toLowerCase())):rawItems)
  },[searchParams,rawItems || null])
  

  // Mutation for deleting an item
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return fetch(`${url}/items/${id}`, {
        method: 'DELETE',
      }).then(res => {
        if (!res.ok) {
          throw new Error('Failed to delete item');
        }
      });
    },
    onSuccess: () => {
      // Invalidate and refetch items after deletion
      queryClient.invalidateQueries(["items"]);
    },
    onError: (error) => {
      // Handle error (e.g., display a message)
      alert(`Error: ${error.message}`);
    },
  });

  // Loading state
  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Handle delete action
  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  return (
    <div>
        <form className="mx-auto mb-2 flex justify-between" style={{width:"80%"}} onSubmit={(e)=>{e.preventDefault();addSearchParam(search)}}>
        <input onChange={(e)=>setSearch(e.target.value)} type="text" name="name" id="name" placeholder='search for item' className='bg-gray-200 border outline-none border-gray-400 rounded px-5 py-2 w-full' style={{width:"85%",transitionDuration:".3s"}} />
        <input className='py-2 px-5 font-semibold text-gray-200 rounded bg-gray-700 ml-2' type='submit' value={"search"}/>
      </form>
      <div className="item-item my-10 py-3 rounded-t-md text-gray-100 font-semibold bg-purple-500">
        <span className="col">Serial Number</span>
        <span className="col">Item Name</span>
        <span className="col col1">Instock</span>
        <span className='col'>Action</span>
      </div>
      {items?.map(item => (
        <div className={`item-item items ${item.id % 2 === 1 ? "bg-gray-200" : "bg-gray-300"}`} key={item.id}>
          <span className="col">{item.serial_number}</span>
          <span className="col">{item.name}</span>
          <span className="col col1">{item.instock} {item.unit}</span>
          <span className='col'>
            <button 
              className='bg-red-500 item-btn hover:bg-red-600' 
              onClick={() => handleDelete(item.id)}
            >
              Delete
            </button>
            {/*<button className='bg-cyan-500 item-btn ml-8 hover:bg-cyan-600'>Details</button>*/}
          </span>
        </div>
      ))}
    </div>
  );
};