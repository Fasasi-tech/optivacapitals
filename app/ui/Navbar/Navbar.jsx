'use client'

import { useStateContext } from '@/app/context/ContextProvider';
import ToggleMode from '@/app/utils/ToggleMode';
import React from 'react'
import { FaBars } from "react-icons/fa";
import {useDispatch, useSelector} from 'react-redux'

const Navbar = () => {
    const {open, setOpen} = useStateContext()
    const {isAuthenticated, user} = useSelector((state) => state.auth)
  return (
    <>
      { isAuthenticated &&
          (<div className='w-full px-4 lg:px-16'>
              <div className='mt-8'>
                  <div className='bg-white dark:bg-slate-800 p-4 mx-4 py-4 rounded-md flex items-center justify-between align-center'>
                      <FaBars
                      className="text-[#722f37]  text-3xl   cursor-pointer"
                      onClick={() => setOpen(!open)}
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