'use client'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { Formik } from 'formik'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Loader from '@/app/utils/Loader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useRouter} from 'next/navigation'
import { useGetLeaveQuery, useGetEmployeesQuery, usePostedLeaveQuery, useAcknowledgementMutation } from '../slices/usersApiSlice'
import { useGetProfilesQuery } from '../slices/profileApiSlice'


const Acknowledgement = () => {
    const {data:leave, isLoadingLeave, errorLeave} = usePostedLeaveQuery()
    const {data:LeaveData, isLoadingProfile, errorProfile} =useGetProfilesQuery()
    const {data:employee_list, isLoading:employee_list_loading, error:employee_list_error} = useGetEmployeesQuery()
    const [Acknowledgement, {status, error, isLoading}] = useAcknowledgementMutation()


    if(isLoadingLeave ||isLoadingProfile || employee_list_loading){
        return <Loader/>
    }

    if(errorLeave ||employee_list_loading){
        return <p>something went wrong</p>
    }

   
    console.log(leave)
    const result= leave?.value;
    console.log('result', result)

    const value= employee_list?.value

    const findCompanyEmail=LeaveData?.userPrincipalName
 
    const getEmpNo=value.find((val) => val.Company_E_Mail === findCompanyEmail)

   const ResultEmpNo = getEmpNo?.No;
   console.log('ResultEmpNo', ResultEmpNo)

    const fresult= result?.filter((v) =>v.Status === 'Posted').filter((f) => f.Employee_No=== ResultEmpNo);
    console.log('fresult', fresult)

    // const final=fresult?.filter((f) => f.Employee_No==='OCP00109');
    // console.log(final, 'final')

    const handleApplicationCode = () =>{
        fresult
    }


    const getEmployeeNo =(code)=>{
        
        const Employee_Number = fresult.find((i) => code === i.Application_Code)

        if (Employee_Number){
            const {Employee_No} = Employee_Number

            return `${Employee_No}`
                } else if (!Employee_Number){
        return ''
     }

    }

    const getEmployeeName =(code)=>{
        
        const Employee_Number = fresult.find((i) => code === i.Application_Code)

        if (Employee_Number){
            const {Names} = Employee_Number

            return `${Names}`
                } else if (!Employee_Number){
        return ''
     }

    }

    const getEmployeeLeaveType =(code)=>{
        
        const Employee_Number = fresult.find((i) => code === i.Application_Code)

        if (Employee_Number){
            const {Leave_Type} = Employee_Number

            return `${Leave_Type}`
                } else if (!Employee_Number){
        return ''
     }

    }

    const getEmployeeStartDate =(code)=>{
        
        const Employee_Number = fresult.find((i) => code === i.Application_Code)

        if (Employee_Number){
            const {Start_Date} = Employee_Number

            return `${Start_Date}`
                } else if (!Employee_Number){
        return ''
     }

    }

    const getEmployeeDaysApplied =(code)=>{
        
        const Employee_Number = fresult.find((i) => code === i.Application_Code)

        if (Employee_Number){
            const {Approved_Days} = Employee_Number

            return `${Approved_Days}`
                } else if (!Employee_Number){
        return ''
     }

    }

    const getEmployeeReturnDate =(code)=>{
        
        const Employee_Number = fresult.find((i) => code === i.Application_Code)

        if (Employee_Number){
            const {Return_Date} = Employee_Number

            return `${Return_Date}`
                } else if (!Employee_Number){
        return ''
     }

    }

    const handleSubmit = async (values, {setSubmitting, resetForm})=>{
        try{
            await Acknowledgement(values).unwrap()
            setSubmitting(true)
            toast.success('Acknowledgement form submitted successfully!')
            resetForm()
        }catch(err){
            if (err?.data?.error?.message) {
                toast.error(err?.data?.error?.message);
            } else if (err?.data?.error) {
                toast.error(err?.data?.error);  // Handles error: "Values must be provided in the body."
            } else {
                toast.error('An unexpected error occurred');
            }
    }

    }
  
  return (
    <div className='w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg md:w-full mx-auto'>
        <Formik initialValues={{
            Leave_No:"",
            Actual_Days_Spent:"",
            Actual_Return_Day:"",
            Comment:""


        }}

        validate={(values) =>{

            const errors={}

            if (!values.Leave_No){
                errors.Leave_No= 'Required'
            }

            if (!values.Actual_Days_Spent){
                errors.Actual_Days_Spent= 'Required'
            }

            if (!values.Actual_Return_Day){
                errors.Actual_Return_Day= 'Required'
            }


            return errors;
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
                <div className=' w-full h-full md:mt-8 py-4 md:pt-12 pb-24 px-4  md:px-12   my-auto'>
                    <form onSubmit={handleSubmit}>
                        <div className='flex justify-start   font-medium mb-8'>
                            <h1 className='font-libre-baskerville font-bold  text-[#722f37]'>Leave Acknowledgement Form</h1>   
                        </div>
                        <div className='grid lg:grid-cols-2 place-items-center  gap-x-8'>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Leave_No" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Leave No</label>
                                    <select
                                        type='text'
                                        name='Leave_No'
                                        id="Leave_No"
                                        value={values.Leave_No}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onClick={handleApplicationCode}
                                        placeholder='Leave No'
                                         className='p-2 w-full outline-none dark:bg-slate-800 border border-solid  border-slate-300 text-gray-500 h-12 bg-transparent'
                                    >
                                          <option></option>
                                    {fresult?.map((f) =>(
                                      
                                        <option key={f.Application_Code} value={f.Application_Code}>
                                            {f.Application_Code}
                                        </option>
                                    ))}

                                    </select>
                                {touched.Leave_No && errors.Leave_No ?<div className='text-red-500 pl-2 font-semibold'>{errors.Leave_No}</div>: null}
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Days_Applied" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Employee No</label>
                                <Input
                                    type='text'
                                    placeholder='Employee No'
                                    value={values.Leave_No && getEmployeeNo(values.Leave_No)}
                                    className='p-2 w-full outline-none  border border-solid border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent  '
                                    readOnly
                                />
                            
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Employee Name" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Employee Name</label>
                                <Input
                                    type='text'
                                   readOnly
                                    placeholder='Employee Name'
                                    value={values.Leave_No && getEmployeeName(values.Leave_No)}
                                    className='p-2 w-full outline-none  border border-solid border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent  '
                                />
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Leave Type" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Leave Type</label>
                                <Input
                                    type='text'
                                   readOnly
                                    placeholder='Leave Type'
                                    value={values.Leave_No && getEmployeeLeaveType(values.Leave_No)}
                                    className='p-2 w-full outline-none  border border-solid border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent  '
                                />
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Start Date" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Start Date</label>
                                <Input
                                    type='date'
                                   readOnly
                                    placeholder='Start Date'
                                    value={values.Leave_No && getEmployeeStartDate(values.Leave_No)}
                                    className='p-2 w-full outline-none  border border-solid border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent  '
                                />
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Days Applied" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Days Applied</label>
                                <Input
                                    type='Number'
                                   readOnly
                                    placeholder='Days Applied'
                                    value={values.Leave_No && getEmployeeDaysApplied(values.Leave_No)}
                                    className='p-2 w-full outline-none  border border-solid border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent  '
                                />
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Return Date" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Return Date</label>
                                <Input
                                    type='date'
                                   readOnly
                                    placeholder='Return Date'
                                    value={values.Leave_No && getEmployeeReturnDate(values.Leave_No)}
                                    className='p-2 w-full outline-none  border border-solid border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent  '
                                />
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Actual Days Spent" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Actual Days Spent</label>
                                <Input
                                    type='Number'
                                    values={values.Actual_Days_Spent}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='Actual_Days_Spent'
                                    name='Actual_Days_Spent'
                                    placeholder='Actual Days Spent'
                                    className='p-2 w-full outline-none  border border-solid border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent'
                                />
                                {touched.Actual_Days_Spent && errors.Actual_Days_Spent ?<div className='text-red-500 pl-2 font-semibold'>{errors.Actual_Days_Spent}</div>: null}
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Actual Return Day" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Actual Return Day</label>
                                <Input
                                    type='Date'
                                    values={values.Actual_Return_Day}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    id='Actual_Return_Day'
                                    name='Actual_Return_Day'
                                    placeholder='Actual_Return_Day'
                                    className='p-2 w-full outline-none  border border-solid border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent'
                                />
                                {touched.Actual_Return_Day && errors.Actual_Return_Day ?<div className='text-red-500 pl-2 font-semibold'>{errors.Actual_Return_Day}</div>: null}
                            </div>
                            <div className='h-12 mb-12 w-full '>
                            <label htmlFor="comment" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>comment</label>
                                <Textarea
                                    placeholder="Type your message here."
                                    type="text"
                                    name="Comment"
                                    id="Comment"
                                    value={values.Comment}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                 />
                                 {touched.Comment && errors.Comment ?<div className='text-red-500 pl-2 font-semibold'>{errors.Comment}</div>: null}
                            </div> 
                        </div>
                        <div className='w-full h-12 my-8 pt-4 '>
                            <button type="submit" className={`bg-[#722f37]  w-full  text-white  rounded-lg py-4 ${ isSubmitting? 'opacity-50 cursor-not-allowed':''} `} disabled={ isSubmitting}> {isSubmitting ? 'Submitting...' : 'Submit'}</button>
                        </div>
                    </form>
                </div>
            )}
        </Formik>
        <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />   
    </div>
  )
}

export default Acknowledgement