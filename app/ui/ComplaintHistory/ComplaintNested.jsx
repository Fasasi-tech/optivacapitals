// 'use client'
// import React from 'react'
// import { useComplaintDialogQuery } from '../slices/usersApiSlice'
// import Loader from '@/app/utils/Loader'
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// const ComplaintNested = ({params}) => {
//     const {id} = params;

//     const {data, isLoading, error} = useComplaintDialogQuery(id)

//     if (isLoading){
//         return <Loader />
//     }

//     if (error){
//         return <p className='text-gray-500 font-semibold'>Something went wrong!</p>
//     }

//     const result= data?.value
//   return (
//     <>
//         <div className='flex justify-start  font-medium mb-8'>
//             <h1 className='font-libre-baskerville font-bold  text-[#722f37]'>Complaint History</h1>
//         </div>
//         <div className='bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg overflow-auto'>
//             <Table>
//                 <TableHeader>
//                 <TableRow>
//                     <TableHead className='py-8'>Comment</TableHead>
//                     <TableHead className='py-8'>Comment By</TableHead>
//                     <TableHead className='py-8'>Comment Date</TableHead>
//                     <TableHead className='py-8'>Seen Date</TableHead>
//                 </TableRow>
//                 </TableHeader>
//                 <TableBody>
//               {
//                 result && result.map((i, index) => (
//                   <TableRow key={index}>
//                     <TableCell>{i.Comment}</TableCell>
//                     <TableCell>{i.Comment_By}</TableCell>
//                     <TableCell>{i.Seen}</TableCell>
//                     <TableCell>{i.Seen_By}</TableCell>
//                     <TableCell>{i.Seen_Date}</TableCell>
//                   </TableRow>
//                 ))
//               }
//             </TableBody>   
//             </Table>
//         </div>


//     </>
//   )
// }

// export default ComplaintNested