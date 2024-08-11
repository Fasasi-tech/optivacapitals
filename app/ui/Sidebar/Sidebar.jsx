'use client'

import { useStateContext } from '@/app/context/ContextProvider';
import { Menus } from '@/app/utils/Menus';
import Link from 'next/link';
import { useMsal } from '@azure/msal-react'
import { usePathname } from 'next/navigation';
import {useState, useEffect} from 'react';

import { CiLogout } from "react-icons/ci";
import { signIn, signOut } from '../slices/authActions'
import {useDispatch, useSelector} from 'react-redux'
import logo from '../../../public/optivac.png'
import Image from 'next/image'
import { IoCloseSharp } from "react-icons/io5";
import { useRouter } from 'next/navigation';

const Sidebar = () => {

    const dispatch = useDispatch()
    const { instance, accounts } = useMsal();
    const router = useRouter();
    const {open, setOpen} = useStateContext()
    const pathname= usePathname()
    const isActive = (path) => path === pathname;
    const [mounted, setMounted] = useState(false);
    const {isAuthenticated, user} = useSelector((state) => state.auth)
  
    useEffect(() => {
        setMounted(true);
      }, []);

      useEffect(() => {
        if (!isAuthenticated){
          router.push('/')
        } 
      }, [router, !isAuthenticated])
      
    
    //   if (!mounted) {
    //     return null; // Render nothing until the component has mounted
    //   }

      
    const handleSignOut = () => {
    dispatch(signOut(instance));
    router.push('/');
  };

     if (!mounted) {
        return null; // Render nothing until the component has mounted
      }

  
  return (
    <>
       { isAuthenticated && (<div className={`flex h-screen relative dark:bg-slate-800 ` }>
            <div className={`bg-white dark:bg-slate-800 p-5 pt-8 ${open ? 'w-60' : 'w-0'} duration-300 overflow-auto relative ${!open && 'hidden'}`}>
                < IoCloseSharp className={`text-[#722f37]  text-4xl absolute -right-0 top-9 pr-4 md:hidden visible  cursor-pointer`}  onClick={() =>setOpen(!open)}/>
                <div className= 'w-32'>
                    <Image
                        src={logo}
                        alt='image' 
                        className='w-full h-full'
                        />
                </div>
                <div className="mt-8">
                    {Menus.map((menu) => {
                        return (
                            <div key={menu.id || index} className='mt-4' title={menu.title}>
                                <Link href={menu.path} className={`flex items-center justify-start gap-4 py-4 px-2 font-bold ${isActive(menu.path)? 'bg-[#722f37] py-4  rounded-lg text-white': ''}  cursor-pointer rounded-lg `}>
                                    <span className="">
                                        {menu.icon}
                                    </span>
                                    <span >
                                        {menu.title}
                                    </span>
                                </Link>
                            </div>
                        )
                    })}
                    <div  className="flex items-center justify-start gap-4 py-4 px-2 font-bold bg-gray-200 dark:bg-slate-800 rounded-lg mt-8 cursor-pointer"  onClick={handleSignOut}>
                        <span className="">
                            <CiLogout />
                        </span>
                        <span className={`${!open && "hidden"} `}>
                            Log out
                        </span>
                    </div>
                    
                </div> 
            </div>
            {/* {!open && (
          
        )} */}
        </div>)}

    </>
  )
}

export default Sidebar