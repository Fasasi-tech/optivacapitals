'use client'
import React, {useState, useEffect} from 'react'
import {Formik} from 'formik'
import { Input } from '@/components/ui/input'
import { useGetEmployeesQuery, useGetLeavePeriodQuery, useGetLeaveTypesQuery,  useGetResponsibilityCenterQuery, useLeaveMutation } from '../slices/usersApiSlice'
import Loader from '@/app/utils/Loader'
import { useGetProfilesQuery } from '../slices/profileApiSlice'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
const Leave = () => {
    const [returningDate, setReturningDate] = useState('');
    const {data:responsibility_center, isLoading, error} = useGetResponsibilityCenterQuery()
    const {data:leave_period, isLoading:leave_period_loading, error:leave_error}= useGetLeavePeriodQuery()
    const {data:leave_type, isLoading:leave_type_loading, error:leave_type_error}=useGetLeaveTypesQuery()
    const {data:employee_list, isLoading:employee_list_loading, error:employee_list_error} = useGetEmployeesQuery()
   const {data:getReliever, isLoading:loadingReliever, error:loadingError} = useGetProfilesQuery()

    const [Leave, {status, error:submitError, isLoading:Loading}] = useLeaveMutation()
    if(isLoading || leave_period_loading || leave_type_loading || employee_list_loading  ){
        return <Loader />
    }

        
    

    if (error || leave_error || leave_type_error || employee_list_error ){
        return <p>Something went wrong!</p>
    }

    // console.log(responsibility_center.value)
    // console.log(leave_period.value)
    // console.log(leave_type.value)
    // console.log(employee_list)

    const {value} = employee_list
    console.log('val', value)

    const generateReliever= getReliever?.userPrincipalName
    // const {userPrincipalName} = generateReliever
    console.log('bc',generateReliever)

    const response=value.find ((val) =>  generateReliever === val.Company_E_Mail)

    const add = response.No
    console.log('add', add)
   
    // console.log('reliever:', getReliever)

    const getRelieverResponsibilityCenter=value.find((i) => generateReliever ===i.Company_E_Mail )
    const r_center = getRelieverResponsibilityCenter?.Department_Code
    
    // console.log('r_center', r_center)
    // console.log(value)

    

    const handleLeavePeriodClick = () =>{
        leave_period
    }

    const handleLeaveTypeClick = () =>{
        leave_type
    }

    const handleEmployeeTypeClick = () =>{
        employee_list
    }

    
    const getEmployeeApplicantName= (email)=>{

       const getCompanyEmail= value.find((i) => email === i.Company_E_Mail)
       if (getCompanyEmail){

            const {First_Name, Last_Name}=getCompanyEmail
            return `${First_Name} ${Last_Name}`

        } else if (!getCompanyEmail){
        return 'Employee not found!'
        } 
    }

    const getJobTitle= (email)=>{
        const getCompanyEmail= value.find((i) => email === i.Company_E_Mail)
        if (getCompanyEmail){
             const {Job_Title}=getCompanyEmail
             return `${Job_Title} `
         } else if (!getCompanyEmail){
         return 'Employee not found!'
         } 
     }

     const getEmployeeNo= (email)=>{
        const getCompanyEmail= value.find((i) => email === i.Company_E_Mail)
        if (getCompanyEmail){
             const {No}=getCompanyEmail
             return `${No} `
         } else if (!getCompanyEmail){
         return 'Employee not found!'
         } 
     }

     const getDepartment =(email)=>{
        
        const getCompanyEmail = value.find((i) => email === i.Company_E_Mail)

        if (getCompanyEmail){
            const {Department_Code} = getCompanyEmail

            return `${Department_Code}`
                } else if (!getCompanyEmail){
        return 'Employee not found!'
     }

    }

    

     const calculateMinDate = () =>{
        const currentDate = new Date()
        currentDate.setDate(currentDate.getDate() +3);
        return currentDate.toISOString().split('T')[0]
     }
     
     
     // Check if a date is a weekday
  const isWeekday = (date) => date.getDay() !== 0 && date.getDay() !== 6;

  const calculateReturningDate = (Start_Date, Days_Applied) => {
    if (!Start_Date) {
      //console.error('Invalid input. Please provide a valid start date and days applied.');
      setReturningDate('');
      return;
    }

    const startDate = new Date(Start_Date);
    let remainingDays = parseInt(Days_Applied);

    while (remainingDays > 0) {
      startDate.setDate(startDate.getDate() + 1);
      if (isWeekday(startDate)) {
        remainingDays -= 1;
      }
    }

    setReturningDate(startDate.toISOString().split('T')[0]); // Format as YYYY-MM-DD
  };


  const handleSubmit = async (values, {setSubmitting, resetForm}) =>{
    try{

        const {Responsibility_Center, ...restValues}= values
        await Leave(restValues).unwrap()
        setSubmitting(true)
        // alert('complaint form submitted succesfully')
        toast.success('Leave form submitted successfully');
        resetForm()
    }catch (err){
        // console.log(err?.data?.error?.message)
        if(err && err?.data?.error?.message){
            toast.error(err?.data?.error?.message)
        } else {
            toast.error('someting went wrong')
        }
    }
 }

    

  return (
    <div className='w-full bg-white dark:bg-slate-800 shadow-lg rounded-lg  md:w-full mx-auto'>
        
        <Formik initialValues={{
            // Responsibility_Center:"",
            Company_Email:`${generateReliever}`,
            Leave_Period:"",
            Leave_Type:'',
            Days_Applied:"",
            Cell_Phone_Number:"",
            E_mail_Address:"",
            Employee_Reliver:"",
            Start_Date:""
        }}

        validate ={(values) => {

            const errors={}

            // if (!values.Responsibility_Center){
            //     errors.Responsibility_Center='Required'
            // }

            if (!values.Company_Email){
                errors.Company_Email='Required'
            } else if(!values.Company_Email.toLowerCase().endsWith('@optivacp.com')){
                errors.Company_Email='Invalid email address'
            }

            if (!values.Leave_Period){
                errors.Leave_Period='Required'
            }

            if (!values.Leave_Type){
                errors.Leave_Type='Required'
            }

            if (!values.Days_Applied){
                errors.Days_Applied='Required'
            }

            if (!values.Cell_Phone_Number){
                errors.Cell_Phone_Number = 'Required'
            }

            if (!values.Employee_Reliver){
                errors.Employee_Reliver = 'Required'
            }

            if (!values.Start_Date){
                errors.Start_Date = 'Required'
            }else {
                const startDate = new Date(values.Start_Date);
                if (!isWeekday(startDate)) {
                  errors.Start_Date = 'Start date cannot be on a weekend';
                }
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
            isSubmitting,
           }) => {
            useEffect(() => {
                if (values.Start_Date && values.Days_Applied) {
                  calculateReturningDate(values.Start_Date, values.Days_Applied);
                }
              }, [values.Start_Date, values.Days_Applied]);
                
              return (
            <div className=' w-full h-full md:mt-8 py-4 md:py-12 px-4  md:px-12   my-auto'>
                <form onSubmit={handleSubmit}>
                    <div className='flex justify-start  font-medium mb-8'>
                        <h1 className='font-libre-baskerville font-bold  text-[#722f37]'>Leave Application Registration</h1>
                    </div>
                    <div className='grid lg:grid-cols-2 place-items-center  gap-x-8'>
                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Responsibility Center" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Responsibility Center</label>
                            <Input      
                                type='text'
                                name="Responsibility_Center"
                                id='Responsibility_Center'
                                value={values.Company_Email && getDepartment(values.Company_Email)}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder='Responsibility Center'
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid  border-slate-300 text-gray-500 h-12 bg-transparent  '
                             />
                                 {/* <option>{isLoading && 'Loading'}</option>
                                     {responsibility_center.value.map((center) =>(
                                    <option key={center.Id} value={center.Id} >
                                        {center.Code}
                                    </option>
                                ))}
                            </select> */}
                            {touched.Responsibility_Center && errors.Responsibility_Center ? <div className='text-red-500 pl-2 font-semibold'>{errors.Responsibility_Center}</div>: null}
                        </div>

                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Company Email" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Company Email</label>
                            <Input
                                type='text'
                                name="Company_Email"
                                id='Company_Email'
                                value={values.Company_Email}
                                readOnly
                                onChange={handleChange}
                                onBlur={handleBlur}
                                placeholder='Company Email'
                                className='p-2 w-full outline-none border dark:bg-slate-800 border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                            {touched.Company_Email && errors.Company_Email ?<div className='text-red-500 pl-2 font-semibold'>{errors.Company_Email}</div>: null}
                        </div>

                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Applicant Name" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Applicant Name</label>
                            <Input
                                type=''
                                name=""
                                id=''
                                value={values.Company_Email && getEmployeeApplicantName(values.Company_Email)}
                                readOnly
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                placeholder='Applicant Name'
                                className='p-2 w-full outline-none border dark:bg-slate-800 border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                        </div>

                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Job Title" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Job Title</label>
                            <Input
                                type=''
                                name=""
                                id=''
                                value={values.Company_Email && getJobTitle(values.Company_Email)}
                                readOnly
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                placeholder='Job Title'
                                className='p-2 w-full outline-none border dark:bg-slate-800 border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                        </div>

                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Employee No" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Employee No</label>
                            <Input
                                type=''
                                name=""
                                id=''
                                value={values.Company_Email && getEmployeeNo(values.Company_Email)}
                                readOnly
                                // onChange={handleChange}
                                // onBlur={handleBlur}
                                placeholder='Employee No'
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                        </div>

                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Leave_Period" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Leave Period</label>
                            <select       
                                type='text'
                                name="Leave_Period"
                                id='Leave_Period'
                                value={values.Leave_Period}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onClick={handleLeavePeriodClick}
                                placeholder='Leave Period'
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid  border-slate-300 text-gray-500 h-12 bg-transparent  '
                            >
                               <option>{isLoading && 'Loading'}</option>
                               {leave_period.value.map((center) =>(
                                <option key={center.Id} value={center.Id} >
                                    {center.Period_Code}
                                </option>
                               ))}
                            </select>
                            {touched.Leave_Period && errors.Leave_Period ?<div className='text-red-500 pl-2 font-semibold'>{errors.Leave_Period}</div>: null}
                        </div>
                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Leave_Type" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Leave Type</label>
                            <select       
                                type='text'
                                name="Leave_Type"
                                id='Leave_Type'
                                placeholder='Leave Type'
                                value={values.Leave_Type}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onClick={handleLeaveTypeClick}
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid  border-slate-300 text-gray-500 h-12 bg-transparent  '
                            >
                                <option>{isLoading && 'Loading'}</option>
                                    {leave_type.value.map((center) =>(
                                    <option key={center.Id} value={center.Id} >
                                    {center.Code}
                                </option>
                               ))}
                            </select>
                            {touched.Leave_Type &&errors.Leave_Type ?<div className='text-red-500 pl-2 font-semibold'>{errors.Leave_Type}</div>: null}
                        </div>
                        
                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Days_Applied" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Days Applied</label>
                            <Input
                                type='number'
                                name="Days_Applied"
                                id='Days_Applied'
                                placeholder='Days Applied'
                                value={values.Days_Applied}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className='p-2 w-full outline-none  border border-solid border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent  '
                            />
                            {touched.Days_Applied && errors.Days_Applied ?<div className='text-red-500 pl-2 font-semibold'>{errors.Days_Applied}</div>: null}
                        </div>

                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Start_Date" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Start Date</label>
                            <Input
                                type='date'
                                name="Start_Date"
                                id='Start_Date'
                                placeholder='Start Date'
                                value={values.Start_Date}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                min={calculateMinDate()}
                                className='p-2 w-full outline-none border border-solid  border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent'
                            />
                            {touched.Start_Date && errors.Start_Date ?<div className='text-red-500 pl-2 font-semibold'>{errors.Start_Date}</div>: null}
                        </div>
                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Returning date" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Returning date</label>
                            <Input
                                type='date'
                                placeholder='Returning Date'
                                value={returningDate}
                                readOnly
                                
                                className='p-2 w-full outline-none border border-solid  border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent'
                            />
                            {/* {touched.Start_Date && errors.Start_Date ?<div className='text-red-500 pl-2 font-semibold'>{errors.Start_Date}</div>: null} */}
                        </div>

                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Cell_Phone_Number" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Phone Number</label>
                            <Input
                                type='text'
                                name="Cell_Phone_Number"
                                id='Cell_Phone_Number'
                                placeholder='Phone Number'
                                value={values.Cell_Phone_Number}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                className='p-2 w-full outline-none border border-solid  border-slate-300 bg-white dark:bg-slate-800 text-gray-500 h-12 bg-transparent'
                            />
                            {touched.Cell_Phone_Number && errors.Cell_Phone_Number ?<div className='text-red-500 pl-2 font-semibold'>{errors.Cell_Phone_Number}</div>: null}
                        </div>
                        <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Employee_Reliver" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Employee Reliever</label>
                            <select       
                                type='text'
                                name="Employee_Reliver"
                                id='Employee_Reliver'
                                placeholder='Employee Reliever'
                                value={values.Employee_Reliver}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                onClick={handleEmployeeTypeClick}
                                className='p-2 w-full outline-none border border-solid dark:bg-slate-800 border-slate-300 text-gray-500 h-12 bg-transparent'
                            >
                                <option>{isLoading && 'Loading'}</option>
                                    {value.filter( (i) => r_center === i.Department_Code).map((center) =>(
                                    <option key={center.No} value={center.No} >
                                         {center.No} {' '} {center.First_Name} {' '}  {center.Last_Name} {' '}  ({center.Department_Code})
                                    </option>
                               ))}

                            </select>
                            {touched.Employee_Reliver &&errors.Employee_Reliver ?<div className='text-red-500 pl-2 font-semibold'>{errors.Employee_Reliver}</div>: null}
                        </div>                
                    </div>
                    <div className='w-full h-12 my-8 pt-4 '>
                        <button type="submit" className={`bg-[#722f37]  w-full  text-white  rounded-lg py-4 ${ isSubmitting? 'opacity-50 cursor-not-allowed':''} `} disabled={ isSubmitting}> {isSubmitting ? 'Submitting...' : 'Submit'}</button>
                    </div>
                </form>

            </div>
           )}}
        </Formik>
        <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />   
    </div>
  )
}

export default Leave