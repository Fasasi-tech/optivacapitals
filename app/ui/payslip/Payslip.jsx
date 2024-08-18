'use client'
import React, { useEffect, useState } from 'react'
import { useGetEmployeesQuery, usePayrollQuery, usePayslipCardQuery } from '../slices/usersApiSlice'
import { useGetProfilesQuery, useProfileMutation } from '../slices/profileApiSlice'
import Loader from '@/app/utils/Loader'
import DialogPlaySlip from './DialogPlaySlip'
import { Input } from '@/components/ui/input'


const Payslip = () => {
    const [add, setAdd] = useState(null)
    const {data:getUser, isLoading:loadingUser, error:loadingError } = useGetProfilesQuery()
    const {data:employee_list, isLoading:employee_list_loading, error:employee_list_error} = useGetEmployeesQuery()
    const {data:payroll, isLoading:payroll_loading, error:payroll_error} = usePayrollQuery()
    const {data, isLoading, error} = usePayslipCardQuery(add ? `${add}` : '', {
        skip: !add, // Skip the query if add is not set
      })
   
       const findEmployeeAndSetAdd = () => {
        const getPayslipUser = getUser?.userPrincipalName;
        const getCompanyEmail = employee_list?.value?.find((v) => getPayslipUser === v.Company_E_Mail);
        const searchResult = getCompanyEmail?.No;

        if (searchResult && searchResult !== add) {
            setAdd(searchResult);
        }
    }

    // UseEffect to find and set the employee based on user data and employee list
    useEffect(() => {
        if (employee_list && getUser) {
            findEmployeeAndSetAdd();
        }
    }, [employee_list, getUser, add]);

    // Find the payroll data that matches the employee code
    const payrollResult = payroll?.value?.find((p) => add === p.employee_code);

    console.log(payrollResult, 'payrollResult')

    const formatToNaira = (amount) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
        }).format(amount);
    };


    if (loadingUser || employee_list_loading || isLoading || payroll_loading ) {
        return <Loader />
    }

    if (loadingError || employee_list_error ||payroll_error) {
        return <div className='text-[#722f37]'>Oops, error fetching data</div>
    }

  return (
    <div className='bg-white dark:bg-slate-800 w-full p-8 border rounded-lg border-dashed'>
        <div className=' '>
            <div  className=' pb-4'>
            <DialogPlaySlip />
            </div>
            
        </div>
        {data && (
          <>
            <p className="text-[#722f37] font-extrabold" >Employee Details</p>
           <div className='grid lg:grid-cols-2 place-items-center mt-4  gap-x-8'>
                <div className='h-12 mb-12 w-full'>
                    <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Employee No</label>
                    <Input
                        type='text'
                        value={data.No}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>First Name</label>
                    <Input
                        type='text'
                        value={data.First_Name}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Last Name</label>
                    <Input
                        type='text'
                        value={data.Last_Name}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Middle Name</label>
                    <Input
                        type='text'
                        value={data.Middle_Name}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Date of Birth</label>
                    <Input
                        type='text'
                        value={data.Date_Of_Birth}
                        readOnly
                        placeholder=''
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Department Code</label>
                    <Input
                        type='text'
                        value={data.Department_Code}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Department Name</label>
                    <Input
                        type='text'
                        value={data.DepName}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Salary Grade</label>
                    <Input
                        type='text'
                        value={data.Salary_Grade}
                        readOnly
                        placeholder=''
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Salary Notch Step</label>
                    <Input
                        type='text'
                        value={data.Salary_Notch_Step}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label className='block text-base mb-2 text-gray-500 pl-2 font-semibold'> Posting Group</label>
                    <Input
                        type='text'
                        value={data.Posting_Group}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>HR Posting Group</label>
                    <Input
                        type='text'
                        value={data.Hr_Posting_Group}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                 
           </div> 
           </>
        )}

        {payrollResult && (
            <>
            {/* <div className="flex flex-col bg-white dark:bg-slate-800 w-full px-4  pt-8"> */}
            <p className="text-[#722f37] font-extrabold border-b border-gray-200" >Payment Information</p> 
            <div className='grid lg:grid-cols-2 place-items-center mt-4  gap-x-8'>
                <div className='h-12 mb-12 w-full'>
                    <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Basic Pay</label>
                    <Input
                        type='text'
                        value={formatToNaira(payrollResult.Basic_Pay)}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Cummulative Allowances</label>
                    <Input
                        type='text'
                        value={formatToNaira(payrollResult.Cumm_Allowances)}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Cummulative Basic Pay</label>
                    <Input
                        type='text'
                        value={formatToNaira(payrollResult.Cumm_BasicPay)}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Cummulative Deductions</label>
                    <Input
                        type='text'
                        value={formatToNaira(payrollResult.Cumm_Deductions)}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Cummulative Gross Pay</label>
                    <Input
                        type='text'
                        value={formatToNaira(payrollResult.Cumm_GrossPay)}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Cummulative Net Pay</label>
                    <Input
                        type='text'
                        value={formatToNaira(payrollResult.Cumm_NetPay)}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
                <div className='h-12 mb-12 w-full'>
                    <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Cummulative PAYE</label>
                    <Input
                        type='text'
                        value={formatToNaira(payrollResult.Cumm_PAYE)}
                        placeholder=''
                        readOnly
                        className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                    />
                </div>
            </div>
            </>
            )}
    </div>
  )
}

export default Payslip