import { GiCheckMark } from "react-icons/gi";
import { useGlobalContext } from "./GlobalContext";

export const Success = () => {
    const {setSuccessModal, modalMessage} = useGlobalContext();

  return (
    <div className='bg-gray-50 z-50 rounded border shadow-lg border-gray-300 w-80 px-5 p-1 pb-3 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'>
        <div className='bg-gradient-to-br from-green-700 to-green-500 rounded-full text-white w-20 h-20 flex place-items-center justify-center mx-auto m-2'>
            <GiCheckMark fontSize={30}/>
        </div>
        <p className='text-center text-green-800 text-2xl font-semibold'>Success</p>
        <p className='text-center mx-auto text-gray-700 font-medium '> {modalMessage}</p>
        <button 
        onClick={()=>setSuccessModal(false)}
        className='duration-200 hover:shadow-lg shadow-gray-400 rounded bg-gradient-to-br from-green-700 py-2 cursor-pointer to-green-500 text-gray-50 font-semibold w-full my-2'>
            Close
        </button>
    </div>
  )
}
