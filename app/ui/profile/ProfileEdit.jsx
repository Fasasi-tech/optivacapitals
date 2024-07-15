'use client'
import React, {useState, useEffect} from 'react'
import { FiUser } from "react-icons/fi";
import { FaRegStar, FaPhoneAlt  } from "react-icons/fa";
import { IoMailOutline } from "react-icons/io5";
import { BiDetail } from "react-icons/bi";
import Loader from '@/app/utils/Loader';
import { useGetProfilesQuery } from '../slices/profileApiSlice';
import { useEmployeeCardQuery, useGetEmployeesQuery } from '../slices/usersApiSlice';
import { TbFileDescription } from "react-icons/tb";
import { GiTeamUpgrade } from "react-icons/gi";
import { IoFootstepsOutline } from "react-icons/io5";
import { GiPrivateFirstClass } from "react-icons/gi";
import { MdMergeType,  MdAccountBalance, MdOutlineSubtitles  } from "react-icons/md";

const ProfileEdit = () => {

    const [add, setAdd] = useState(null);

    const {data:getReliever, isLoading:loadingReliever, error:loadingError} = useGetProfilesQuery()
    const {data:employee_list, isLoading:employee_list_loading, error:employee_list_error} = useGetEmployeesQuery()
    const { data, isLoading, error } = useEmployeeCardQuery(add ? `${add}` : '', {
        skip: !add, // Skip the query if add is not set
      });

      useEffect(() => {
        if (employee_list && getReliever) {
          const generateReliever = getReliever?.userPrincipalName;
          const response = employee_list.value.find(val => generateReliever === val.Company_E_Mail);

          if (response) {
            setAdd(response.No);
          }
        }
      }, [employee_list, getReliever]);

  
    if(isLoading || loadingReliever || employee_list_loading){
        return <Loader />
    }

    if (error ||loadingError || employee_list_error){
        return <div className='text-[#722f37]'>oops, error fetching data</div>
    }
    
  return (
    <>
        {
            data && (
                <div className="flex flex-start  ">
                    <div className="flex flex-col bg-white dark:bg-slate-800 w-full  px-4 md:w-1/2  py-12 border rounded-lg border-dashed">
                        <p className="text-[#989898] font-extrabold" >Profile Details</p>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'><FiUser className='text-[#722f37]'/></span>First Name:</p> <p>{data.First_Name}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'><FiUser className='text-[#722f37]'/></span>Last Name:</p><p>{data.Last_Name}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'><IoMailOutline className='text-[#722f37]'/></span>Company Email:</p><p>{data.Company_E_Mail}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'><FiUser className='text-[#722f37]'/></span>Supervisor Name:</p><p>{data.SupervisorNames}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'><FaRegStar className='text-[#722f37]' /></span>Department:</p ><p> {data.Department_Code}</p></div>
                        <div className="text-[#989898] pt-4 flex flex-wrap items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans '><span className='font-medium'> <MdOutlineSubtitles  className='text-[#722f37]' /></span>Job Title:</p> <p className='break-words'> {data.Job_Title}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'> <TbFileDescription className='text-[#722f37]'/></span>Job Description:</p> <p>{data.Job_Description}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'> < GiTeamUpgrade  className='text-[#722f37]'/></span>Salary Grade:</p> <p>{data.Salary_Grade}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'> <IoFootstepsOutline className='text-[#722f37]'/></span>Salary Step:</p> <p>{data.Salary_Step}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'> <GiPrivateFirstClass className='text-[#722f37]'/></span>Employee Classification:</p> <p>{data.Employee_Classification}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'> <MdMergeType  className='text-[#722f37]'/></span>Employment Type:</p> <p>{data.Employment_Type}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'> < MdAccountBalance  className='text-[#722f37]'/></span>Annual Leave Balance:</p> <p>{data.Leave_Balance}</p></div>

                    </div>
                </div>
            )
        }
    </>
  )
}

export default ProfileEdit