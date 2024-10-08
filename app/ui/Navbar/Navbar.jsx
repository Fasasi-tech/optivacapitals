'use client'

import { useStateContext } from '@/app/context/ContextProvider';
import ToggleMode from '@/app/utils/ToggleMode';
import React, {useEffect} from 'react'
import { FaBars } from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux'

const Navbar = () => {
    const {open, setOpen, screenSize, setScreenSize} = useStateContext()
    const {isAuthenticated, user} = useSelector((state) => state.auth)

    useEffect(() => {
      const handleResize = () => setScreenSize(window.innerWidth);
  
      window.addEventListener('resize', handleResize);
  
      handleResize();
  
      return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
      if (screenSize <= 900) {
        setOpen(false);
      } else {
        setOpen(true);
      }
    }, [screenSize]);

    const handleActiveMenu = () => setOpen(!open);
  return (
    <>
      { isAuthenticated &&
          (<div className='w-full p-0 lg:px-4'>
              <div className='mt-4'>
                  <div className='bg-white dark:bg-slate-800 px-2 lg:p-4 mx-4 py-2  rounded-md flex items-center justify-between align-center'>
                      <FaBars
                      className="text-[#722f37] text-xl  cursor-pointer"
                      onClick={handleActiveMenu}
                  />
                  <ToggleMode/>
                  </div>
              </div>
          </div>)
      }
    </>
  )
}

export default Navbar