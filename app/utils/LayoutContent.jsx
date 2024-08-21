'use client'
import React, {useEffect, useState} from 'react'
import { useStateContext } from '../context/ContextProvider'

import Navbar from '../ui/Navbar/Navbar'
import Sidebar from '../ui/Sidebar/Sidebar'

const LayoutContent = ({children}) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // Or return a loading spinner, etc.
  }
    const {open} = useStateContext()
  return (
    <>
      <div  className={`${open ? 'w-60 fixed z-50 md:z-40 dark:bg-secondary-dark-bg bg-white':'w-0'}`}>
        <Sidebar />
      </div>
      <div className={` bg-main-bg min-h-screen w-full overflow-x-auto  ${open ? 'md:ml-60':'flex-1'}`}>
          <div className="fixed md:sticky md:top-0  z-40  w-full flex flex-wrap">
            <Navbar />
          </div>
          <div className='mt-24 mb-8 md:mt-4'>
            {children}
          </div>
      </div>
    </>
  )
}

export default LayoutContent