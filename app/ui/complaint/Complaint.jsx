'use client'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import { Formik } from 'formik'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useComplaintMutation, useGetEmployeesQuery, useGetLeaveQuery } from '../slices/usersApiSlice'
import Loader from '@/app/utils/Loader'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useGetProfilesQuery } from '../slices/profileApiSlice'
import { useRouter} from 'next/navigation'


const Complaint = () => {
    const {data:employee_list, isLoading:employee_list_loading, error:employee_list_error} = useGetEmployeesQuery()
    const [Complaint, {status, error, isLoading}] = useComplaintMutation()
    const {data:LeaveData, isLoadingLeave, errorLeave} =useGetProfilesQuery()

    if (employee_list_loading){
        return <Loader />
    }

    if (employee_list_error){
        return <p>Something went wrong!</p>
    }

    const router = useRouter()
    const {value}= employee_list
  
    const findCompanyEmail=LeaveData?.userPrincipalName
 
    const getEmpNo=value.find((val) => val.Company_E_Mail === findCompanyEmail)

   const ResultEmpNo = getEmpNo?.No;
   console.log('ResultEmpNo', ResultEmpNo)

    const getEmployeeDepartmentCode =(emp)=>{
        const findEmployee= value.find((e)=> e.No ===emp)

        if (findEmployee){
            const {Department_Code} = findEmployee
            return `${Department_Code}`
        } else if (!findEmployee)
        return 'Employee not found!'

    }

    const getEmployeeName =(emp)=>{
        const findEmployee= value.find((e)=> e.No ===emp)

        if (findEmployee){
            const {First_Name} = findEmployee
            const {Last_Name} = findEmployee

            return `${First_Name} ${Last_Name}`
        } else if (!findEmployee){
            return 'Employee not found!'
        }




    }

    const getEmployeeJobTitle =(emp)=>{
        const findEmployee= value.find((e)=> e.No ===emp)

        if (findEmployee){
            const {Job_Title} = findEmployee

            return `${Job_Title}`
        } else if (!findEmployee){
            return `Employee not found!`
        }


    }

    const getCompanyEmail =(emp)=>{
        const findEmployee= value.find((e)=> e.No ===emp)

        if (findEmployee){
            const {Company_E_Mail}= findEmployee
            return `${Company_E_Mail}`
        } else if (!findEmployee){
            return 'Employee not found!'
        }


    }


     const handleSubmit = async (values, {setSubmitting, resetForm}) =>{
        try{
            await Complaint(values).unwrap()
            setSubmitting(true)
            toast.success('Complaint form submitted successfully!');
            resetForm()
            router.push('/Complaint')
        }catch (err){
           
        if(err && err?.data?.error?.message){
            toast.error(err?.data?.error?.message)
            } else {
                toast.error('someting went wrong')
            }
        }
     }

     
  return (
    <div className='w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg md:w-full mx-auto'>
        <Formik initialValues={{
            Employee_No:`${ResultEmpNo}`,
            Nature_of_Complaint:"",
            Date_of_incident:"",
            Details_of_Incident:"",

        }}
        validate={(values) =>{

            const errors={}

            if (!values.Employee_No){
                errors.Employee_No = 'Required'
            }

            if (!values.Nature_of_Complaint){
                errors.Nature_of_Complaint='Required'
            }

            if (!values.Date_of_incident){
                errors.Date_of_incident ='Required'
            }

            
            if (!values.Details_of_Incident){
                errors.Details_of_Incident ='Required'
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
                <div className=' w-full h-full md:mt-8 py-4 md:py-12 px-4  md:px-12   my-auto'>
                    <form onSubmit={handleSubmit}>
                        <div className='flex justify-start   font-medium mb-8'>
                            <h1 className='font-libre-baskerville font-bold  text-[#722f37]'>Complaint Form</h1>
                        </div>
                        <div className='grid lg:grid-cols-2 place-items-center  gap-x-8'>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Employee_No" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Employee No</label>
                                <Input
                                    type='text'
                                    name="Employee_No"
                                    id='Employee_No'
                                    value={values.Employee_No}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    readOnly
                                    placeholder='Employee No'
                                    className='p-2 w-full dark:bg-slate-800 outline-none border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                                {touched.Employee_No && errors.Employee_No ?<div className='text-red-500 pl-2 font-semibold'>{errors.Employee_No}</div>: null}
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Employee_Name" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Employee Name</label>
                                <Input
                                    type='text'
                                    name=""
                                    id=''
                                    value={values.Employee_No && getEmployeeName(values.Employee_No) }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Employee No'
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                                {/* {touched.Employee_No && errors.Employee_No ?<div className='text-red-500 pl-2 font-semibold'>{errors.Employee_No}</div>: null} */}
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Department_Code" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Department Code</label>
                                <Input
                                    type='text'
                                    name=""
                                    id=''
                                    value={values.Employee_No && getEmployeeDepartmentCode(values.Employee_No) }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Department Code'
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                                {/* {touched.Employee_No && errors.Employee_No ?<div className='text-red-500 pl-2 font-semibold'>{errors.Employee_No}</div>: null} */}
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Job_Title" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Job Title</label>
                                <Input
                                    type='text'
                                    name=""
                                    id=''
                                    value={values.Employee_No && getEmployeeJobTitle(values.Employee_No) }
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Job Title'
                                    className='p-2 w-full outline-none border dark:bg-slate-800 border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                                {/* {touched.Employee_No && errors.Employee_No ?<div className='text-red-500 pl-2 font-semibold'>{errors.Employee_No}</div>: null} */}
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Company_Email" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Company Email</label>
                                <Input
                                    type='text'
                                    name=""
                                    id='l'
                                    value={values.Employee_No && getCompanyEmail(values.Employee_No)}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Company Email'
                                    className='p-2 w-full outline-none border dark:bg-slate-800 border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                                {/* {touched.Company_Email && errors.Company_Email ?<div className='text-red-500 pl-2 font-semibold'>{errors.Company_Email}</div>: null} */}
                            </div>
                            
                            
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Nature of Complaint</label>
                                <Input
                                    type='text'
                                    name="Nature_of_Complaint"
                                    id='Nature_of_Complaint'
                                    value={values.Nature_of_Complaint}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Nature of Complaint'
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                                {touched.Nature_of_Complaint && errors.Nature_of_Complaint ?<div className='text-red-500 pl-2 font-semibold'>{errors.Nature_of_Complaint}</div>: null}
                            </div>
                            <div className='h-12 mb-12 w-full'>
                                <label htmlFor="Date_of_incident" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Date of Incident</label>
                                <Input
                                    type='date'
                                    name="Date_of_incident"
                                    id='Date_of_incident'
                                    value={values.Date_of_incident}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    placeholder='Date of incident'
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                                {touched.Date_of_incident && errors.Date_of_incident ?<div className='text-red-500 pl-2 font-semibold'>{errors.Date_of_incident}</div>: null}
                            </div>
                            <div className='h-12 mb-12 w-full mt-4'>
                            <label htmlFor="Details_of_Incident" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Details of Incident</label>
                                <Textarea
                                    placeholder="Type your message here."
                                    type="text"
                                    name="Details_of_Incident"
                                    id="Details_of_Incident"
                                    value={values.Details_of_Incident}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                 />
                                 {touched.Details_of_Incident && errors.Details_of_Incident ?<div className='text-red-500 pl-2 font-semibold'>{errors.Details_of_Incident}</div>: null}
                            </div> 
                        </div>
                        <div className='mt-16'>
                            <Button variant="secondary" className={`${ isSubmitting? 'opacity-50 cursor-not-allowed':''}`}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
                        </div>
                    </form>
                </div>
            )}
        </Formik>   
        <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />   
    </div>
  )
}

export default Complaint