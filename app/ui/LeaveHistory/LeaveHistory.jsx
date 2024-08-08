'use client'
import React, {useState} from 'react'
import { useGetLeaveQuery } from '../slices/usersApiSlice'
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
import { useGetProfilesQuery } from '../slices/profileApiSlice'

const LeaveHistory = () => {
    const {data:LeaveData, isLoading, error} =useGetLeaveQuery()
    const {data, isLoading:HistoryLoading, error:errorLoading} = useGetProfilesQuery()

   
    const [currentPage, setCurrentPage] = useState(1)
    if (isLoading || HistoryLoading){
        return <Loader />
    }

    if (error || errorLoading){
        return  <p>Something went wrong!</p>
    }

     const {value}= LeaveData;
     const help=data

     

     const findCompanyEmail=help.userPrincipalName
     

     const sortedDateArray = [...value].sort((a,b) => {
        const dateA = a.Application_Code.slice(3);
        const dateB= b.Application_Code.slice(3)
        return dateB - dateA
     })
  
   const result=sortedDateArray.filter((i)=> i.Company_Email === findCompanyEmail)
    
   

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

    const formatDateWithCommas = (date) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
      const dateString = date.toLocaleDateString('en-US', options);
      
      // Ensure the format is correct by splitting and joining
      const dateParts = dateString.split(' ');
      return `${dateParts[0]}, ${dateParts[1].replace(',', '')}, ${dateParts[2]}`;
    };

    const paginatedData = paginate(result, itemsPerPage, currentPage)
  return (
    <>
     <div className='flex justify-start font-medium mb-8'>
            <h1  className='font-libre-baskerville font-bold text-[#722f37]'>Leave History</h1>
        </div>
    <div className='bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg overflow-x-auto'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='py-8'> Application Code </TableHead>
                        <TableHead className='py-8'> Company Email </TableHead>
                        <TableHead className='py-8'> Days Applied </TableHead>
                        <TableHead className='py-8'> Employee No </TableHead>
                        {/* <TableHead className='py-8'> End Date </TableHead> */}
                        <TableHead className='py-8'> Leave Type </TableHead>
                        <TableHead className='py-8'> Names </TableHead>
                        <TableHead className='py-8'> Reliever Name </TableHead>
                        <TableHead className='py-8'> Return Date </TableHead>
                        <TableHead className='py-8'> Start Date </TableHead>
                        <TableHead className='py-8'> Status </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody >
                {paginatedData.map((i, index) =>(
                    <TableRow key={index}>
                        <TableCell>{i.Application_Code}</TableCell>
                        <TableCell>{i.Company_Email}</TableCell>
                        <TableCell>{i.Days_Applied}</TableCell>
                        <TableCell>{i.Employee_No}</TableCell>
                        {/* <TableCell>{i.End_Date}</TableCell> */}
                        <TableCell>{i.Leave_Type}</TableCell>
                        <TableCell>{i.Names}</TableCell>
                        <TableCell>{i.Reliever_Name}</TableCell>
                        <TableCell>{formatDateWithCommas(new Date(i.Return_Date))}</TableCell>
                        <TableCell>{formatDateWithCommas(new Date(i?.Start_Date))}</TableCell>
                        <TableCell ><p className={`p-1 w-20 text-center rounded-lg  font-semibold ${i.Status === 'Pending Approval' ? 'bg-blue-200 text-blue-600' : i.Status === 'New' ? 'bg-yellow-100 text-yellow-600' : i.Status === 'Approved' ? 'bg-green-200 text-green-400' : i.Status === 'Rejected' ? 'bg-red-200 text-red-600' :'bg-teal-200 text-teal-600'}`  }>{i.Status}</p></TableCell>
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

export default LeaveHistory