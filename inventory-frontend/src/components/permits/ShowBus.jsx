import React from 'react'
import classNames from 'classnames'
import { useQuery } from '@tanstack/react-query'
import { deleteFetch, FetchSource } from '../utilities/FetchSource'
import { Loader } from '../utilities/Loader'
import moment from 'moment'
import './Permits.css'
import { useGlobalContext } from '../utilities/GlobalContext'

export const ShowBus = ({ show, setShowBus, regNumber, refetch }) => {
    const {setErrorModal, setModalMessage, setSuccessModal} = useGlobalContext();
    const getStatus = bus => {
        switch(bus.status){
            case "AlmostExpired" : return {
                textColor:"text-amber-600",
                color:"bg-amber-600",
                sign: <>&#x21;</>,
                text: "Some permits expiring soon. Action may be required!!"
            };
            case "Expired": 
            return {
                color:"bg-red-600",
                textColor:"text-red-700",
                sign: <>&#x21;</>,
                text: "Expired permits found. Immediate action required!!"
            };
            default : 
            return {
                color: "bg-green-600",
                textColor: "text-green-700",
                sign: <>&#10003;</>,
                text: "All permits are valid. No action needed!!!"
                }
        }
    }
    const fetchPermit = async () => {
        if (!regNumber) return Promise.resolve(null);
        return fetch(FetchSource().source+"buses?regNumber="+regNumber)
            .then(res => {
                if (!res.ok) throw new Error('Bus not found');
                return res.json();
            })
            .then(data=>{
                return data;
            });
    };

    const handleDelete = (regNumber) => {
        deleteFetch("buses?regNumber="+regNumber).catch(err => console.error(err.message));
        setShowBus(false);
        setModalMessage("Delete Completed Successfully!!!");
        setSuccessModal(true);
        setTimeout(()=>{
            window.location.reload()
        },1500)
    }

    const { data: bus, isLoading, error } = useQuery({
        queryKey: ["bus", regNumber],  // Include regNumber in query key
        queryFn: fetchPermit,
        enabled: !!regNumber && show,  // Only fetch when regNumber exists and modal is shown
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
        setErrorModal(true)
        return <div></div>;
    }

    if (!bus) {
        return (
            <div className={classNames('modal-container duration-200')}>
                <div className='p-5 bg-gray-50 w-96 mx-auto mt-32 rounded'>
                    <p className='text-center text-gray-800'>No bus data found</p>
                    <button 
                        className='bg-green-600 py-2 rounded font-medium text-gray-100 w-full mt-4' 
                        onClick={() => setShowBus(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={classNames(show? 'modal-container duration-300' : 'modal-hidden')}>
        <div className='p-5 bg-gray-50 w-96 mx-auto m-12 rounded'>
            <div className={classNames(getStatus(bus).color,'mx-auto text-5xl font-bold h-20 w-20 rounded-full text-gray-50 flex justify-center place-items-center')}>{getStatus(bus).sign}</div>
            <p className={classNames(getStatus(bus).textColor,'font-medium text-center text-sm')}>{getStatus(bus).text}</p>
            <div className='py-5'>
                <p className='text-2xl capitalize text-gray-800 border p-1 font-medium text-center'>{regNumber} {bus.depot}</p>
                <p className='modal-p'>Passenger Insurance <span>{moment(bus.passengerInsurance).format("DD MMMM YYYY")}</span></p>
                <p className='modal-p'>Vehicle License <span>{moment(bus.vehicleLicence).format("DD MMMM YYYY")}</span></p>
                <p className='modal-p'>Vehicle Insurance <span>{moment(bus.vehicleInsurance).format("DD MMMM YYYY")}</span></p>
                <p className='modal-p'>Certificate Of Fitness <span>{moment(bus.certificateOfFitness).format("DD MMMM YYYY")}</span></p>
                <p className='modal-p'>Route Authority <span>{moment(bus.routeAuthority).format("DD MMMM YYYY")}</span></p>
            </div>
            <button className={classNames('bg-gradient-to-br from-gray-600 to-gray-800 py-2 rounded font-medium text-gray-100 w-full mb-2')} onClick={()=>handleDelete(bus.regNumber)}>Delete</button>
            <button className={classNames(getStatus(bus).color,'py-2 rounded font-medium text-gray-100 w-full')} onClick={()=>setShowBus(false)}>Close</button>
        </div>
    </div>
    );
}