import Link from "next/link";
import Image from "next/image";
import CentralBar from "@/app/components/navbar/CentralBar";
import UserNav from "@/app/components/navbar/UserNav";
import AddInvoiceButton from "@/app/components/navbar/AddInvoiceButton";
import {getUserId} from "@/app/lib/actions";

const Navbar = async () =>{
    const userId = await getUserId();


    return(<nav className="w-full fixed top-0 left-0 py-6 border-b bg-white z-10">
        <div className="max-w-[1500px] mx-auto px-6">
            <div className="flex justify-between items-center">
                <Link href="/">
                    <div className="flex flex-row items-center">

                    <Image
                        src="/invoice.png"
                        alt="Djangoabnb logo"
                        width={30}
                        height={30}
                    />
                        <h2 className="text-xl ml-3 text-blue-400 font-semibold">Invoices</h2>
                    </div>

                </Link>

                <div className="flex space-x-6">
                    <CentralBar/>
                </div>
                <div className="flex items-center space-x-6">
                    <AddInvoiceButton userid={userId}/>
                    <UserNav userId={userId}/>
                </div>
            </div>
        </div>
    </nav>)
}

export default Navbar;