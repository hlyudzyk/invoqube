 'use client'

import useLoginModal from "@/app/hooks/useLoginModal";

interface AddInvoiceProps{
  userid?:string|null;
}

const AddInvoiceButton:React.FC<AddInvoiceProps> = ({userid}) =>{
  const loginModal = useLoginModal();

  const onAddInvoiceClick = () => {
      console.log("sdsaaa")
  }

   return (
       <div className="p-2 cursor-pointer text-sm font-semibold rounded-full hover:bg-gray-200"
          onClick={onAddInvoiceClick}>
          Add invoice
       </div>
   )
}

export default AddInvoiceButton;