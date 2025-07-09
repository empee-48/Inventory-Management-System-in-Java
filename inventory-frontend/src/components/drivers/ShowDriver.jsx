import React from 'react'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { Loader } from '../utilities/Loader'
import moment from 'moment'
import '../permits/Permits.css'
import { deleteFetch, getFetch } from '../utilities/FetchSource'
import { useGlobalContext } from '../utilities/GlobalContext'

export const ShowDriver = ({ show, setShowDriver, driverId }) => {
    const {setErrorModal,setModalMessage, setSuccessModal} = useGlobalContext()

    const displayStatus = driver => {
        switch(driver.status){
            case "AlmostExpired" : return {
                textColor:"text-amber-600",
                color:"bg-amber-600",
                sign: <>&#x21;</>,
                text: "Some documents expiring soon. Action may be required!!"
            };
            case "Expired": 
            return {
                color:"bg-red-600",
                textColor:"text-red-700",
                sign: <>&#x21;</>,
                text: "Expired documents found. Immediate action required!!"
            };
            default : 
            return {
                color: "bg-green-600",
                textColor: "text-green-700",
                sign: <>&#10003;</>,
                text: "All documents are valid. No action needed!!!"
                }
        }
    }

    const fetchDriver = async () => {
        if (!driverId) return Promise.resolve(null);
        return getFetch("drivers?driverId="+driverId)
        .then(data=>{
            return data;
        });
    };

    const handleDelete = driverId => {
        deleteFetch("drivers?id="+driverId).catch(err=>console.err(err.message));
        setModalMessage("Delete Completed Successfully!!!");
        setShowDriver(false)
        setSuccessModal(true);
        setTimeout(()=>{
            window.location.reload()
        },1500)
    }

    const { data: driver, isLoading, error } = useQuery({
        queryKey: ["driver", driverId],  // Include regNumber in query key
        queryFn: fetchDriver,
        enabled: !!driverId && show,  // Only fetch when regNumber exists and modal is shown
    });

    if (!show) return null;  // Don't render anything if modal is hidden

    if (isLoading) {
        return (
            <div className={classNames('modal-container duration-200')}>
                <div className='p-5 bg-gray-50 w-96 mx-auto mt-32 rounded'>
                    <Loader />
                </div>
            </div>
        );
    }

    if (error) {
        setModalMessage(error.message);
        setErrorModal(true);
        return <div></div>
    }

    if (!driver) {
        return (
            <div className={classNames('modal-container duration-200')}>
                <div className='p-5 bg-gray-50 w-96 mx-auto rounded-'>
                    <p className='text-center text-gray-800'>No driver data found</p>
                    <button 
                        className='bg-green-600 py-2 rounded font-medium text-gray-100 w-full mt-4' 
                        onClick={() => setShowDriver(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={classNames(show? 'modal-container duration-300' : 'modal-hidden')}>
        <div className='p-5 bg-gray-50 w-96 mx-auto mt-16 rounded'>
            <div className={classNames(displayStatus(driver).color,'mx-auto text-5xl font-bold h-20 w-20 rounded-full text-gray-50 flex justify-center place-items-center')}>{displayStatus(driver).sign}</div>
            <p className={classNames(displayStatus(driver).textColor,'font-medium text-center text-sm')}>{displayStatus(driver).text}</p>
            <div className='py-5'>
                <p className='text-2xl capitalize text-gray-800 border p-1 font-medium text-center mb-2 border-gray-500'>{driver.firstName} {driver.lastName}</p>
                <p className='text-2xl capitalize text-gray-800 border p-1 font-medium text-center border-gray-500'>{driverId} {driver.depot}</p>
                <p className='modal-p'>Medical <span>{moment(driver.medical).format("DD MMMM YYYY")}</span></p>
                <p className='modal-p'>Retest <span>{moment(driver.retest).format("DD MMMM YYYY")}</span></p>
                <p className='modal-p'>Defensive <span>{moment(driver.defensive).format("DD MMMM YYYY")}</span></p>
            </div>
            <button className={classNames("bg-gradient-to-br mb-2 from-gray-600 to-gray-800",'py-2 rounded font-medium text-gray-100 w-full')} onClick={()=>handleDelete(driverId)}>Delete</button>
            <button className={classNames(displayStatus(driver).color,'py-2 rounded font-medium text-gray-100 w-full')} onClick={()=>setShowDriver(false)}>Close</button>
        </div>
    </div>
    );
}