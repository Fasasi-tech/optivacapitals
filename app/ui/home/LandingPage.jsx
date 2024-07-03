'use client'
import React, {useEffect} from 'react'
import { useMsal } from '@azure/msal-react'
import {useDispatch, useSelector} from 'react-redux'
import { signIn, signOut } from '../slices/authActions'
import { useRouter } from 'next/navigation';
import Image from 'next/image'
import landingImage from '../../../public/cropped.png'
import logo from '../../../public/optivac.png'

const LandingPage = () => {

  const dispatch = useDispatch()
  const {isAuthenticated, user} = useSelector((state) => state.auth)
  const { instance, accounts } = useMsal();
  const router = useRouter();

  const handleSignIn = () => {
    dispatch(signIn(instance, accounts));
};

const handleSignOut = () => {
  dispatch(signOut(instance));
};

useEffect(() => {
  if (isAuthenticated){
    router.push('/Complaint')
  } 
}, [router, isAuthenticated])


  return (
    <div className='h-screen overflow-hidden flex flex-col'>
    <div className='flex-shrink-0 p-4'>
      <Image
          src={logo}
          alt='logo'
          width={150} 
          height={50} 
          />
    </div>
      <div className='flex flex-grow flex-col lg:flex-row items-start  lg:items-center h-[50%]  justify-normal lg:justify-between'>
        <div className='lg:w-1/3 p-4  order-2 lg:order-1' >
          <h1 className='text-2xl  md:text-4xl lg:text-6xl font-black text-[#722f37] font-libre-baskerville'>Leave Management</h1>
          <p className='mt-4 font-libre-baskerville  font-bold text-lg text-blue-900'> Streamline your leave request, apply for time-off in minutes.</p>
          {isAuthenticated ? (
             <div className='mt-4 lg:mt-16 '>
              <button onClick={handleSignOut} className='w-full md:w-auto px-16 rounded-md text-lg font-bold hover:bg-[#b6868c]  bg-[#722f37]  py-4'>Logout</button>
             </div>
          ):(
            <div className='mt-4 lg:mt-16 '>
              <button onClick={handleSignIn} className='w-full md:w-auto px-16 rounded-md text-lg font-bold hover:bg-[#b6868c]  bg-[#722f37]  py-4'>Login</button>
            </div>
          )
          }

        </div>
        <div className='w-full lg:w-2/3 h-[50%] md:h-[70%] lg:h-full order-1 lg:order-2'>
          <Image
            src={landingImage}
            alt='image'
            className='w-full h-full'
          />
        </div>
      </div>
    </div>
  )
}

export default LandingPage


