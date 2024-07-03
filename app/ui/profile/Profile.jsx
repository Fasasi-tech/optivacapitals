'use client'
import React, { useState } from 'react'
import { FiUser } from "react-icons/fi";
import { FaRegStar, FaPhoneAlt  } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { BiDetail } from "react-icons/bi";
import Loader from '@/app/utils/Loader';
import { useGetProfilesQuery } from '../slices/profileApiSlice';
import { FaEdit } from "react-icons/fa";
import ProfileEdit from './ProfileEdit';
import ProfileForm from './ProfileForm';



const Profile = () => {
    const [edit, setEdit] = useState(true)
    const {data, isLoading, error} = useGetProfilesQuery()

    const changeProfileState =()=>{
        setEdit(!edit)
    }


    // console.log(data)
    if(isLoading){
        return <Loader />
    }

    if (error){
        return <div className='text-[#722f37]'>oops, error fetching data</div>
    }

  return (
    <>
     {edit ?(  
         <ProfileEdit changeState={changeProfileState} />
        ) :<ProfileForm changeState={changeProfileState} />
}
    </>
  )
}

export default Profile