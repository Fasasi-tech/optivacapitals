'use client'
import React, {useState} from 'react'
import { useComplaintListPageQuery } from '../slices/usersApiSlice'
import { useGetProfilesQuery } from '../slices/profileApiSlice'
import Loader from '@/app/utils/Loader'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
import ComplaintDialog from './ComplaintDialog'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const ComplaintHistory = () => {
    const {data, isLoading, error} = useComplaintListPageQuery()
    const {data:profileData, isLoading:HistoryLoading, error:errorLoading} = useGetProfilesQuery()

    const [currentPage, setCurrentPage] = useState(1)

    if (isLoading || HistoryLoading){
        return <Loader />
    }

    if (error || errorLoading){
        return <p>Something went wrong!</p>
    }

    const {value} = data;
    const findCompanyEmail = profileData.userPrincipalName;

    console.log(value, 'valueResult')

    const sortedArray= [...value].sort((a,b) =>{
        const sortA= a.Complaint_No.slice(5)
        const sortB = b.Complaint_No.slice(5)
        return sortB - sortA
    })

    const result = sortedArray.filter((i) => i.Company_Email === findCompanyEmail)
    console.log('res', result)

    // const result2 = result.filter((r) => r.Status ==='Closed')


    const paginate = (array, pageSize, pageNumber) => {
        return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
      };

      const itemsPerPage =5

    const totalPages= Math.ceil(result.length / itemsPerPage)

    const handleNextPage = () =>{
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
    }

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage -1, 1))

    }

    const paginatedData = paginate(result, itemsPerPage, currentPage)

    const formatDateWithCommas = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateString = date.toLocaleDateString('en-US', options);
      
      // Ensure the format is correct by splitting and joining
      const dateParts = dateString.split(' ');
      return `${dateParts[0]}, ${dateParts[1].replace(',', '')}, ${dateParts[2]}`;
    };
  return (
    <>
     <div className='flex justify-start  font-medium mb-8'>
        <h1 className='font-libre-baskerville font-bold  text-[#722f37]'>Complaint History</h1>
     </div>
    <div className='bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg overflow-auto'>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className='py-8'> Complaint No.</TableHead>
                    <TableHead className='py-8'> Company Email </TableHead>
                    <TableHead className='py-8'> Date of Incident </TableHead>
                    <TableHead className='py-8'> Department Code </TableHead>
                    <TableHead className='py-8'> Details of Incident </TableHead>
                    <TableHead className='py-8'> Employee Name </TableHead>
                    <TableHead className='py-8'> Employee No </TableHead>
                    <TableHead className='py-8'> Job Description </TableHead>
                    <TableHead className='py-8'> Job Title </TableHead>
                    <TableHead className='py-8'> Nature of Complaint </TableHead>
                    <TableHead className='py-8'> Supervisor </TableHead>
                    <TableHead className='py-8'>View message</TableHead>
                    <TableHead className='py-8'> Status </TableHead>
                </TableRow>
            </TableHeader>
            <TableBody >
            {paginatedData.map((i, index) =>(
                <TableRow key={index}>
                    <TableCell>{i.Complaint_No}</TableCell>
                    <TableCell>{i.Company_Email}</TableCell>
                    <TableCell>{formatDateWithCommas(new Date(i.Date_of_incident))}</TableCell>
                    <TableCell>{i.Department_Code}</TableCell>
                    <TableCell>{i.Details_of_Incident}</TableCell>
                    <TableCell>{i.Employee_Name}</TableCell>
                    <TableCell>{i.Employee_No}</TableCell>
                    <TableCell>{i.Job_Description}</TableCell>
                    <TableCell>{i.Job_Title}</TableCell>
                    <TableCell>{i.Nature_of_Complaint}</TableCell>
                    <TableCell>{i.Supervisor}</TableCell>
                    <TableCell><Link href={`/Complaint-History/${i.Complaint_No}/comment`}><Button variant='outline'>view Response</Button></Link></TableCell>
                    <TableCell ><p className={`p-1 w-20 text-center rounded-md text-white font-semibold ${i.Status === 'Closed' ? 'bg-green-200 text-green-700':  'bg-red-200 text-red-700'}`}>{i.Status}</p></TableCell>
                </TableRow>
                ))}
            </TableBody>
        </Table>
        <div className='flex  justify-end pr-10 font-sans text-gray-500 font-bold'>
            <span>
                Page {currentPage} of {totalPages}
            </span>
        </div>
            <div className='flex  justify-end mt-8'>
            <Pagination>
                <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={handlePreviousPage} disabled={currentPage === 1} />
                </PaginationItem>
                <PaginationItem>
                    <PaginationLink href="#">{currentPage}</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" onClick={handleNextPage} disabled={currentPage === totalPages} />
                </PaginationItem>
                </PaginationContent>
            </Pagination> 
          
            </div>
            
        </div>
    </>
  )
}

export default ComplaintHistory