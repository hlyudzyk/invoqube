 'use client'

import useLoginModal from "@/app/hooks/useLoginModal";

interface AddInvoiceProps{
  userid?:string|null;
}

const AddInvoiceButton:React.FC<AddInvoiceProps> = ({userid}) =>{
  const loginModal = useLoginModal();

  const lightbaseYourHome = () => {
      console.log("sdsaaa")
  }

   return (
       <div className="p-2 cursor-pointer text-sm font-semibold rounded-full text-brand bg-accent hover:bg-accent-dark transition-colors"
          onClick={lightbaseYourHome}>
          Add invoice
       </div>
   )
}

export default AddInvoiceButton;