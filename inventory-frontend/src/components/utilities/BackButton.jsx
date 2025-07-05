import { MdKeyboardDoubleArrowLeft } from "react-icons/md"
import { useNavigate } from "react-router-dom"

export const BackButton = () => {
    const navigate = useNavigate()
  return (
    <p className="grid justify-end px-10">
        <button
        onClick={()=>navigate(-1)}
        className=' text-gray-600 cursor-pointer text-lg flex place-items-center gap-2 font-serif font-medium'>
            <MdKeyboardDoubleArrowLeft /> Go Back
        </button>
    </p>
  )
}
