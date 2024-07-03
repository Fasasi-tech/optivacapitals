'use client'
import React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {Formik} from 'formik'
import { BiSolidUserDetail } from "react-icons/bi";
import { FaPhoneAlt } from "react-icons/fa";
import { Button } from '@/components/ui/button';
import { MdCancel } from "react-icons/md";
import { MdOutlineTitle } from "react-icons/md";
import { useGetProfilesQuery, useProfileMutation } from '../slices/profileApiSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

const ProfileForm = ({changeState}) => {
    //const {data, isLoading, error} = useGetProfilesQuery()
    const [Profile, {status, error, isLoading}] = useProfileMutation()
       
        const handleSubmit = async (values, {setSubmitting, resetForm}) =>{
            try{
                const filteredValues = Object.fromEntries(Object.entries(values).filter(([_, v]) => v !== ''));
                await Profile(filteredValues).unwrap()
                setSubmitting(true)
                toast.success('Profile updated successfully')
                resetForm()
            } catch (err) {
                // console.log('Error:', err); // Log the entire error object
                const errorMessage = err?.data?.error?.message || 'An unknown error occurred';
                toast.error(`Error: ${errorMessage}`);
                setSubmitting(false);
            }
        };

  return (
    <>
        <div  className="flex flex-start">
            <div className="flex flex-col bg-white dark:bg-slate-800 w-full  px-4 md:w-1/2  py-12 border rounded-lg border-dashed">
                <Formik initialValues={{
                    givenName:'',
                    surname:"",
                    phone:"",
                    JobTitle:""
                }}
                validate={(values) =>{

                    const errors={}

                    // if(values.phone > 11 || values.phone< 11){
                    //     errors.phone='Invalid phone'

                    // }
                    // return errors;
                }}

                onSubmit={handleSubmit}
                >
                    {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting
                    }) =>(
                        <form onSubmit={handleSubmit}>
                            <div className='flex items-center justify-between'>
                                <p className='font-libre-baskerville font-bold text-[#722f37] '>Edit Profile</p>
                                <MdCancel className='text-2xl text-[#722f37] cursor-pointer' onClick={changeState}/>
                            </div>
                            <div className="grid gap-4 py-4">
                                <div className='grid-cols-4 items-center gap-4 relative'>
                                    <Label htmlFor="First Name" className="text-gray-400">
                                        First Name
                                    </Label>
                                    <div className="absolute top-8 pr-4 bottom-0 left-0 flex items-center pl-3 pointer-events-none">
                                        < BiSolidUserDetail  className="text-gray-400" />
                                    </div>
                                    <Input
                                        type='text'
                                        name="givenName"
                                        id="givenName"
                                        values={values.givenName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        defaultValue="" 
                                        placeholder=' First Name'  
                                        className="col-span-3 mt-2 pl-8 dark:bg-slate-800"
                                    />
                                </div>
                                <div className="grid gap-4 py-4">
                                    <div className='grid-cols-4 items-center gap-4 relative'>
                                        <Label htmlFor="description" className="text-gray-400">
                                            Last Name
                                        </Label>
                                        <div className="absolute top-8 pr-4 bottom-0 left-0 flex items-center pl-3 pointer-events-none">
                                            < BiSolidUserDetail  className="text-gray-400" />
                                        </div>
                                        <Input
                                            type='text'
                                            placeholder="Last Name"
                                            name="surname"
                                            id="surname"
                                            values={values.surname}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            defaultValue="" 
                                            className='col-span-3 mt-2 pl-8 dark:bg-slate-800' 
                                        />
                                    </div>
                                 </div>
                                 <div className='grid-cols-4 items-center gap-4 relative'>
                                    <Label htmlFor="First Name" className="text-gray-400">
                                        phone
                                    </Label>
                                    <div className="absolute top-8 pr-4 bottom-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <FaPhoneAlt className="text-gray-400" />
                                    </div>
                                    <Input
                                        type='number'
                                        name="phone"
                                        id="phone"
                                        values={values.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        defaultValue="" 
                                        placeholder=' phone'  
                                        className="col-span-3 mt-2 pl-8 dark:bg-slate-800"
                                    />
                                     {touched.phone && errors.phone ?<div className='text-red-500 pl-2 font-semibold'>{errors.phone}</div>: null}
                                </div>
                                <div className='grid-cols-4 items-center gap-4 relative'>
                                    <Label htmlFor="First Name" className="text-gray-400">
                                        Job Title
                                    </Label>
                                    <div className="absolute top-8 pr-4 bottom-0 left-0 flex items-center pl-3 pointer-events-none">
                                        <MdOutlineTitle className="text-gray-400" />
                                    </div>
                                    <Input
                                        type='text'
                                        name="JobTitle"
                                        id="JobTitle"
                                        values={values.JobTitle}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        defaultValue="" 
                                        placeholder=' JobTitle'  
                                        className="col-span-3 mt-2 pl-8 dark:bg-slate-800"
                                    />
                                </div>
                                <div className='mt-4'>
                                    <Button  variant="secondary"className={`${ isSubmitting? 'opacity-50 cursor-not-allowed':''}`}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
                                </div>
                                
                                

                            </div>
                        </form>
                    )}
                </Formik>
                <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            </div>
        </div>
    </>
  )
}

export default ProfileForm