import { IoWarning } from "react-icons/io5";
import { useGlobalContext } from "./GlobalContext.Jsx";

export const Error = () => {
    const {setErrorModal, modalMessage} = useGlobalContext();

  return (
    <div className='bg-gray-50 border z-50 shadow-lg border-gray-300 w-80 rounded px-5 p-1 pb-3 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='bg-gradient-to-br from-red-500 to-red-400 rounded-full text-white w-20 h-20 flex place-items-center justify-center mx-auto m-2'>
            <IoWarning fontSize={40}/>
        </div>
        {/* <p className='text-center text-rose-800 text-2xl font-semibold'>Opps</p> */}
        <p className='text-center text-rose-800 text-lg font-semibold'>Something Went Wrong</p>
        <p className='text-center mx-auto text-gray-700 font-medium '> {modalMessage}</p>
        <button 
        onClick={()=>setErrorModal(false)}
        className='duration-200 hover:shadow-lg shadow-gray-400 rounded bg-gradient-to-br from-red-700 py-2 cursor-pointer to-red-500 text-gray-50 font-semibold w-full my-2'>
            Close
        </button>
    </div>
  )
}
