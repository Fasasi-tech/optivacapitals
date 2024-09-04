'use client'
import React, {useState} from 'react'
import { useGetProfilesQuery } from '../slices/profileApiSlice'
import { useAcknowledgementHistoryQuery } from '../slices/usersApiSlice'
import Loader from '@/app/utils/Loader'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext,PaginationPrevious} from "@/components/ui/pagination"


  
  const History = () => {
    const {data:profileData, isLoading:HistoryLoading, error:errorLoading} = useGetProfilesQuery()
    const {data, isLoading, error} = useAcknowledgementHistoryQuery()
    const [currentPage, setCurrentPage] = useState(1)

    if (isLoading ){
        return <Loader/>
    }

    if (error || errorLoading){
        return <p>Something went wrong!</p>
    }

    console.log(data)
    // const {value} = data;
    const findCompanyEmail = profileData.userPrincipalName;

    // console.log(value, 'valueResult')

    // const sortedArray= [...value].sort((a,b) =>{
    //     const sortA= a.Complaint_No.slice(5)
    //     const sortB = b.Complaint_No.slice(5)
    //     return sortB - sortA
    // })
    return (
      <div>
            <p>hi</p>
      </div>
    )
  }
  
  export default History