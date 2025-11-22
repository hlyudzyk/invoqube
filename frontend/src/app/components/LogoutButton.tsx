'use client';

import {useRouter} from "next/navigation";
import { resetAuthCookies } from '../lib/actions'
import MenuLink from "@/app/components/navbar/MenuLink";

const LogoutButton:React.FC = () => {
  const router = useRouter();
  const submitLogOut = async () => {
    resetAuthCookies();
    router.push('/')
  }
  return (<MenuLink label="Log out" onClick={submitLogOut}/>)
}
export default LogoutButton;