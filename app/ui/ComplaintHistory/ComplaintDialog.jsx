// 'use client'
// import React, {useState} from 'react'
// import { Button } from '@/components/ui/button'
// import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger} from "@/components/ui/dialog"
// import Loader from '@/app/utils/Loader'
// import { useComplaintDialogQuery } from '../slices/usersApiSlice'
// import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// const ComplaintDialog = ({id}) => {

//     const [open, setOpen] = useState(false)
//     const {data, isLoading, error} = useComplaintDialogQuery(id, {skip: !open})

//     const handleOpenChange = (isOpen) => {
//         setOpen(isOpen);
//     };

//  const result = data?.value;

//   return (
//    <Dialog open={open} onOpenChange={handleOpenChange}>
//         <DialogTrigger asChild>
//             <Button variant='outline'>view response</Button>
//         </DialogTrigger>
//         <DialogContent className="w-full">
//             <DialogHeader>
//                 <DialogTitle className='text-[#722f37]'>Reponses</DialogTitle>
//             </DialogHeader>
//             {
//                 isLoading ? (<Loader />) : error ? (<p className='font-bold text-red-500'>Error loading data</p>):(
//                     <Table>
//                         <TableHeader>
//                             <TableRow>
//                                 <TableHead className='py-8'>Comment</TableHead>
//                                 <TableHead className='py-8'>Comment By</TableHead>
//                                 <TableHead className='py-8'>Comment Date</TableHead>
//                                 <TableHead className='py-8'>Seen Date</TableHead>
//                             </TableRow>
//                         </TableHeader>
//                         <TableBody>
//                             {
//                                 result && (
//                                     result.map((i, index) =>(
//                                         <TableRow key={index}>
//                                             <TableCell>{i.Comment}</TableCell>
//                                             <TableCell>{i.Comment_By}</TableCell>
//                                             <TableCell>{i.Seen}</TableCell>
//                                             <TableCell>{i.Seen_By}</TableCell>
//                                             <TableCell>{i.Seen_Date}</TableCell>
//                                         </TableRow>
//                                     ))
//                                 )
//                             }
//                         </TableBody>
                        
//                     </Table>

//                 )
//             }
//         </DialogContent>

//    </Dialog>
//   )
// }

// export default ComplaintDialog