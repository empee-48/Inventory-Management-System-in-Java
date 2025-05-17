import React from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { FetchSource } from '../../utilities/FetchSource';

export const ReportsNav = () => {
    const navigate = useNavigate(); // Get the navigate function
    const url = FetchSource().source;
    const mutation = useMutation({
        mutationFn: () => {
            return fetch(`${url}/reports`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // Set content type if needed
                },
            });
        },
        onSuccess: () => {
            alert('Report generated successfully!'); // Success message
            console.log("starting navigation")
            navigate('/'); // Navigate to the /reports page
            console.log("navigation successful")
        },
        onError: (error) => {
            alert(`Error generating report: ${error.message}`); // Error message
        },
    });

    const createReport = () => {
        mutation.mutate(); // Trigger the mutation
    };

    return (
        <div className='bg-gray-100 shadow-lg w-full flex p-3 justify-between px-10'>
            <h3 className='text-gray-800 font-semibold text-3xl'>Reports</h3>
            <button
                className='bg-gray-100 font-semibold text-gray-800'
                onClick={createReport}
                disabled={mutation.isLoading} // Disable button while loading
            >
                {mutation.isLoading ? 'Generating...' : 'Generate Daily Report'}
            </button>
        </div>
    );
};