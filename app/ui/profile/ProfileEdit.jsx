'use State'
import React from 'react'
import { FiUser } from "react-icons/fi";
import { FaRegStar, FaPhoneAlt  } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { BiDetail } from "react-icons/bi";
import Loader from '@/app/utils/Loader';
import { useGetProfilesQuery } from '../slices/profileApiSlice';
import { FaEdit } from "react-icons/fa";
import { MdAlternateEmail } from "react-icons/md";

const ProfileEdit = ({changeState}) => {
    const {data, isLoading, error} = useGetProfilesQuery()

    if(isLoading){
        return <Loader />
    }

    if (error){
        return <div className='text-[#722f37]'>oops, error fetching data</div>
    }

  return (
    <>
        <div>
            {
                data && (
                    <div className="flex flex-start">
                        <div className="flex flex-col bg-white dark:bg-slate-800 w-full  px-4 md:w-1/2  py-12 border rounded-lg border-dashed">
                        <div className='flex items-center justify-between'>
                                <p className="text-[#722f37] font-libre-baskerville font-bold" >
                                    Profile Details
                                </p>
                                <p onClick={changeState}>
                                    <FaEdit className='text-2xl text-[#722f37] cursor-pointer'/>
                                </p>
                            </div>
                            <p className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'><FiUser className='text-[#722f37]'/></span>First Name:</p> <p>{data.givenName}</p></p>
                            <p className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'><FiUser className='text-[#722f37]'/></span>Last Name:</p><p>{data.surname}</p></p>
                            <p className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'><FaRegStar className='text-[#722f37]' /></span>Role:</p ><p> {data.jobTitle}</p></p>
                            <p className="text-[#989898] pt-4 flex flex-wrap items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans '><span className='font-medium'> <IoMailOutline className='text-[#722f37]' /></span>Email:</p> <p className='break-words'> {data.mail}</p></p>
                            <p className="text-[#989898] pt-4 flex flex-wrap items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans '><span className='font-medium'> <MdAlternateEmail className='text-[#722f37]' /></span>Work Mail:</p> <p className='break-words'> {data.userPrincipalName}</p></p>
                            <p className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'> <FaPhoneAlt className='text-[#722f37]'/></span>Phone:</p> <p>{data.mobilePhone}</p></p>
                            <p className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'> <BiDetail className='text-[#722f37]'/></span>Language:</p> <p>{data.preferredLanguage}</p></p>
                        </div>
                    </div>
        
                )
            }
        </div>
    </>
  )
}

export default ProfileEdit