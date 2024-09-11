'use client'
import React, {useState} from 'react'
import { useComplaintDialogQuery, useComplaintMutation, usePostCommentMutation } from '@/app/ui/slices/usersApiSlice'
import Loader from '@/app/utils/Loader'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Formik } from 'formik';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext,PaginationPrevious} from "@/components/ui/pagination"

const page = ({params}) => {
    const {id} = params;

    const {data, isLoading, error} = useComplaintDialogQuery(id)
    const [postComplaint] = usePostCommentMutation()
    const [currentPage, setCurrentPage] = useState(1)
 

    if (isLoading){
        return <Loader />
    }

    if (error){
        return <p className='text-gray-500 font-semibold'>Something went wrong!</p>
    }

    


    console.log(id, 'id')
    const result= data?.value

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




    const handleSubmit = async (values, {setSubmitting, resetForm}) =>{
        try{

            await postComplaint({ complaintNo: id, values }).unwrap()
            setSubmitting(true)
            toast.success('message submitted successfully!')
            resetForm()

        }catch (err){
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
    <div  className='px-4 mt-4 lg:mt-4 xl:px-8 '>
         <div className=' flex flex-wrap justify-between gap-2'>
            <div className='bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg overflow-auto w-full lg:w-3/5'>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead className='py-8 w-1/6'>Comment</TableHead>
                        <TableHead className='py-8 w-1/6'>Comment By</TableHead>
                        <TableHead className='py-8 w-1/6'>Comment Date</TableHead>
                        <TableHead className='py-8 w-1/6'>Seen By</TableHead>
                        <TableHead className='py-8 w-1/6'>Seen Date</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                {
                    paginatedData && paginatedData.map((i, index) => (
                    <TableRow key={index}>
                        <TableCell className='break-words w-1/6'>{i.Comment}</TableCell>
                        <TableCell className='w-1/6'>{i.Comment_By}</TableCell>
                        <TableCell className='w-1/6'>{i.Comment_Date}</TableCell>
                        <TableCell className='w-1/6'>{i.Seen_By}</TableCell>
                        <TableCell className='w-1/6'>{i.Seen_Date ==='0001-01-01'? '': i.Seen_Date}</TableCell>
                    </TableRow>
                    ))
                }
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
           
            <div className='w-full lg:w-1/3 bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg'>
                <Formik initialValues={{
                    Document_No:`${id}`,
                    Comment:""
                }}
                
                validate={(values) =>{
                   const errors={}
                   if (!values.Document_No){
                    errors.Document_No='Required'
                   }
                   if (!values.Comment){
                    errors.Comment ='Required'
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
                                <div className='h-12 mb-12 w-full'>
                                    <label htmlFor="Employee_No" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Document No</label>
                                    <Input
                                        type='text'
                                        name="Document_No"
                                        id='Document_No'
                                        value={values.Document_No}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        readOnly
                                        placeholder='Document_No'
                                        className='p-2 w-full dark:bg-slate-800 outline-none border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                    />
                                    {touched.Document_No && errors.Document_No ?<div className='text-red-500 pl-2 font-semibold'>{errors.Document_No}</div>: null}
                                </div>
                                <div className='h-12 mb-12 w-full mt-4'>
                                    <label htmlFor="Message" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Message</label>
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
                                    {touched.Details_of_Incident && errors.Details_of_Incident ?<div className='text-red-500 pl-2 font-semibold'>{errors.Comment}</div>: null}
                                </div>
                            <div className='mt-24'>
                                <Button variant="secondary" className={`${ isSubmitting? 'opacity-50 cursor-not-allowed':''}`}>{isSubmitting ? 'Submitting...' : 'Submit'}</Button>
                            </div> 
                            </form>
                        </div>
                    )}

              </Formik>
              <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />   
            </div>
        </div>

    </div>
  )
}

export default page