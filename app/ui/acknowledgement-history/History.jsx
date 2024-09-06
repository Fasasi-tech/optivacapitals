'use client'
import React, {useState} from 'react'
import { useGetProfilesQuery } from '../slices/profileApiSlice'
import { useAcknowledgementHistoryQuery, useGetEmployeesQuery } from '../slices/usersApiSlice'
import Loader from '@/app/utils/Loader'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext,PaginationPrevious} from "@/components/ui/pagination"


  
  const History = () => {
    const {data:profileData, isLoading:HistoryLoading, error:errorLoading} = useGetProfilesQuery()
    const {data:employee_list, isLoading:employee_list_loading, error:employee_list_error} = useGetEmployeesQuery()
    const {data, isLoading, error} = useAcknowledgementHistoryQuery()
    const [currentPage, setCurrentPage] = useState(1)
 
    if (isLoading ||employee_list_loading || HistoryLoading ){
        return <Loader/>
    }

    if (error || errorLoading){
        return <p>Something went wrong!</p>
    }

    console.log(data, 'datas')
   
    const findCompanyEmail = profileData?.userPrincipalName;
    const getCompanyEmail = employee_list?.value?.find((v) => findCompanyEmail === v.Company_E_Mail)
    const employeeNo = getCompanyEmail?.No;
    const results = data?.value
    // console.log(value, 'valueResult')

    const sortedArray= [...results].sort((a,b) =>{
        const sortA= a.No.slice(4)
        const sortB = b.No.slice(4)
        return sortB - sortA
    })

    const filterResult = sortedArray.filter((i) => employeeNo === i.Employee_No)

    console.log(filterResult, 'filterResult')

    const paginate = (array, pageSize, pageNumber) => {
        return array.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
      };

      const itemsPerPage =5

    const totalPages= Math.ceil(filterResult.length / itemsPerPage)

    const handleNextPage = () =>{
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages))
    }

    const handlePreviousPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage -1, 1))

    }

    const paginatedData = paginate(filterResult, itemsPerPage, currentPage)
    return (
        <>
            <div className='flex justify-start  font-medium mb-8'>
                <h1 className='font-libre-baskerville font-bold  text-[#722f37]'>Acknowledgement History</h1>
            </div>
            <div className='bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg overflow-auto'>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='py-8'>Acknowledgement No</TableHead>
                            <TableHead className='py-8'>Leave No</TableHead>
                            <TableHead className='py-8'>Employee Name</TableHead>
                            <TableHead className='py-8'>Employee No</TableHead>
                            <TableHead className='py-8'>Days Applied</TableHead>
                            <TableHead className='py-8'>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody >
                        {paginatedData.map((i, index) =>(
                            <TableRow key={index}>
                                <TableCell>{i.No}</TableCell>
                                <TableCell>{i.Leave_No}</TableCell>
                                <TableCell>{i.Employee_Name}</TableCell>
                                <TableCell>{i.Employee_No}</TableCell>
                                <TableCell>{i.Days_Applied}</TableCell>
                                <TableCell ><p className={`p-1 w-20 text-center rounded-md text-white font-semibold ${i.Status === 'Approved' ? 'bg-green-200 text-green-700': i.Status ==='New'?'bg-yellow-200 text-yellow-700' :i.Status ==='Updated'?'bg-red-300 text-red-700':''}`}>{i.Status}</p></TableCell>
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
  
  export default History