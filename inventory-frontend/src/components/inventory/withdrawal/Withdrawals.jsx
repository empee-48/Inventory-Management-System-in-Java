import React,{useState,useEffect} from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import moment from 'moment'
import { FetchSource } from '../../utilities/FetchSource';
import Select from 'react-select';
import { ItemsOptions } from '../../utilities/ItemsOptions';
import { useSearchParams } from 'react-router-dom';

export const Withdrawals = () => {
    const url = FetchSource().source;

    const [searchParams,setSearchParams]=useSearchParams()
    const [search,setSearch]=useState()
    
    const [withdrawals,setWithdrawals]=useState([])
    
    const options = ItemsOptions().options

    const {data: rawWithdrawals,isLoading}=useQuery({
        queryFn:()=>(fetch(`${url}/withdrawals`)
        .then(res=>res.json())),
        queryKey:["rawWithdrawals"]
    })

    const addSearchParams=(name)=>{
        if(name && name!=="--All--"){
            setSearchParams({"name":name})
            return
        }
        searchParams.delete("name")
        setSearchParams(searchParams)
    }
    
    useEffect(()=>
        setWithdrawals(searchParams.get("name")? rawWithdrawals.filter(item=>item.itemName.toLowerCase().includes(searchParams.get("name").toLowerCase())):rawWithdrawals)
    ,[rawWithdrawals,searchParams])

    const queryClient = useQueryClient();

    // Mutation for deleting an item
    const deleteMutation = useMutation({
        mutationFn: (id) => {
        return fetch(`${url}/withdrawals/${id}`, {
            method: 'DELETE',
        }).then(res => {
            if (!res.ok) {
            throw new Error('Failed to delete withdrawal');
            }
        });
    },
        onSuccess: () => {
        // Invalidate and refetch items after deletion
        queryClient.invalidateQueries(["withdrawals"]);
        },
        onError: (error) => {
        // Handle error (e.g., display a message)
        alert(`Error: ${error.message}`);
        },
    });

    // Handle delete action
    const handleDelete = (id) => {
        deleteMutation.mutate(id);
    };

    if(isLoading){
        return <div>Loading...</div>
    }
  
    return (
        <div>
            <form className="mx-auto mb-2 flex justify-center" style={{width:"90%"}}>
                <p className='inline-block' style={{width:"50%"}}> <Select options={options} onChange={selectedOption=>addSearchParams(selectedOption.label)}/> </p>
            </form>
            <div className="restock-item py-3 rounded-t-md text-gray-100 font-semibold bg-purple-800">
                <span className="col">Item Name</span>
                <span className="col">Date</span>
                <span className="col col1">Amount taken</span>
                {/* <span className="col col1">User</span> */}
                <span className='col'>Action</span>
            </div>
            {withdrawals?.map(item=>(
                <div className={`restock-item items ${item.id%2===1? "bg-gray-200":"bg-gray-300"}`} key={item.id}>
                    <span className="col ">{item.itemName}</span>
                    <span className="col">{moment(item.createdAt).format('D MMM, YYYY HH:mm')}</span>
                    <span className="col col1">{item.amount} {item.unit}</span>
                    {/* <span className="col col1">{item.createdBy}</span> */}
                    <span className='col'>
                    <button 
                        className='bg-red-500 item-btn hover:bg-red-600' 
                        onClick={() => handleDelete(item.id)}>
                        Delete
                    </button>
                {/*<button className='bg-cyan-500 item-btn ml-8 hover:bg-cyan-600'>Details</button>*/}
                    </span>
                </div>
            ))}
        </div>
  )
}
