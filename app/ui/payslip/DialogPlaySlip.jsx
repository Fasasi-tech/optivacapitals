

// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useGetProfilesQuery } from '../slices/profileApiSlice';
// import Loader from '@/app/utils/Loader';
// import { useGetEmployeesQuery, usePayrollDateQuery, usePrintPaySlipMutation } from '../slices/usersApiSlice';
// import { Formik } from 'formik';
// import { FaPaypal } from "react-icons/fa";
// import { useToast } from '@/components/ui/use-toast';

// const DialogPaySlip = () => {
//     const { data, isLoading, error } = useGetProfilesQuery();
//     const { data: employee_list, isLoading: employee_loading, error: isError } = useGetEmployeesQuery();
//     const { data: payrolldate, isLoading: payroll_loading, error: payrollerror } = usePayrollDateQuery();
//     const [submitPaySlip] = usePrintPaySlipMutation();
//     const { toast } = useToast();
//     const [isOpen, setIsOpen] = useState(false); // Add state for dialog open/close

//     if (isLoading || employee_loading || payroll_loading) {
//         return <Loader />;
//     }

//     if (error) {
//         return <p className='text-[#722f37]'>Something went wrong</p>;
//     }

//     const result = data?.userPrincipalName;
//     const getEmpNo = employee_list?.value.find((e) => e.Company_E_Mail === result);
//     const resultEmpNo = getEmpNo?.No;

//     const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//         console.log('submitting form with values', values);

//         try {
//             const res = await submitPaySlip(values).unwrap();
//             const base64String = res.value;
//             const cleanedResponse = base64String.replace(/(\r\n|\n|\r)/gm, "");

//             const byteCharacters = atob(cleanedResponse);
//             const byteNumbers = new Array(byteCharacters.length);
//             for (let i = 0; i < byteCharacters.length; i++) {
//                 byteNumbers[i] = byteCharacters.charCodeAt(i);
//             }
//             const byteArray = new Uint8Array(byteNumbers);
//             const blob = new Blob([byteArray], { type: 'application/pdf' });

//             // Download the PDF
//             const link = document.createElement('a');
//             link.href = URL.createObjectURL(blob);
//             link.download = `payslip_${values.employeeNo}_${values.periodDate}.pdf`;
//             document.body.appendChild(link);
//             link.click();
//             document.body.removeChild(link);

//             setSubmitting(false);
//             toast({
//                 title: "Success",
//                 description: 'Payslip downloaded successfully!',
//             });
//             setIsOpen(false); // Close the dialog after success
//         } catch (err) {
//             setSubmitting(false);
//             if (err && err?.data?.error?.message) {
//                 toast({
//                     title: "Error",
//                     description: err?.data?.error?.message,
//                     variant: "destructive"
//                 });
//             } else {
//                 toast({
//                     title: "Error",
//                     description: "Something went wrong",
//                     variant: "destructive"
//                 });
//             }
//         }
//     };

//     return (
//         <div>
//             <Dialog open={isOpen} onOpenChange={setIsOpen}> {/* Control dialog open/close */}
//                 <DialogTrigger asChild>
//                     <Button variant="ghost">
//                         <p className='flex items-center gap-2'> <FaPaypal /> View payslip</p>
//                     </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-sm w-full mx-auto">
//                     <DialogHeader>
//                         <DialogTitle>
//                             View your payslip
//                         </DialogTitle>
//                     </DialogHeader>
//                     <Formik
//                         initialValues={{
//                             employeeNo: `${resultEmpNo}`,
//                             periodDate: ''
//                         }}
//                         validate={(values) => {
//                             const errors = {};
//                             if (!values.periodDate) {
//                                 errors.periodDate = 'Period date is empty!';
//                             }
//                             return errors;
//                         }}
//                         onSubmit={handleSubmit}
//                     >
//                         {({
//                             values,
//                             errors,
//                             touched,
//                             handleChange,
//                             handleBlur,
//                             handleSubmit,
//                             isSubmitting,
//                         }) => (
//                             <form onSubmit={handleSubmit}>
//                                 <div className="grid gap-4 py-2">
//                                     <div className='grid-cols-4 items-center gap-4 relative'>
//                                         <Label htmlFor="employeeNo" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>
//                                             Employee No
//                                         </Label>
//                                         <Input
//                                             type='text'
//                                             name="employeeNo"
//                                             id="employeeNo"
//                                             value={values.employeeNo}
//                                             readOnly
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="grid gap-4 py-2">
//                                     <div className='grid-cols-4 items-center gap-4 relative'>
//                                         <Label htmlFor="periodDate" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>
//                                             Period Date
//                                         </Label>
//                                         <select
//                                             name="periodDate"
//                                             id="periodDate"
//                                             value={values.periodDate}
//                                             onChange={handleChange}
//                                             onBlur={handleBlur}
//                                             className='p-2 w-full outline-none dark:bg-slate-800 border border-solid  border-slate-300 text-gray-500 h-12 bg-transparent'
//                                         >
//                                             <option>{payroll_loading ? 'Loading...' : 'Select a date'}</option>
//                                             {payrolldate?.value?.map((payroll, i) => (
//                                                 <option key={i} value={payroll.Date_Opened}>
//                                                     {payroll.Date_Opened}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {touched.periodDate && errors.periodDate ? (
//                                             <div className='text-red-500 pl-2 text-sm font-semibold'>{errors.periodDate}</div>
//                                         ) : null}
//                                     </div>
//                                 </div>
//                                 <div className='w-full h-12 my-4'>
//                                     <button type="submit" className={`bg-[#722f37] w-full text-white rounded-lg py-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
//                                         {isSubmitting ? 'Downloading...' : 'Download'}
//                                     </button>
//                                 </div>
//                             </form>
//                         )}
//                     </Formik>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }

// export default DialogPaySlip;

// 

// 

// 

// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useGetProfilesQuery } from '../slices/profileApiSlice';
// import Loader from '@/app/utils/Loader';
// import { useGetEmployeesQuery, usePayrollDateQuery, usePrintPaySlipMutation } from '../slices/usersApiSlice';
// import { Formik } from 'formik';
// import { FaPaypal } from "react-icons/fa";
// import { useToast } from '@/components/ui/use-toast';

// const DialogPaySlip = () => {
//     const { data, isLoading, error } = useGetProfilesQuery();
//     const { data: employee_list, isLoading: employee_loading, error: isError } = useGetEmployeesQuery();
//     const { data: payrolldate, isLoading: payroll_loading, error: payrollerror } = usePayrollDateQuery();
//     const [submitPaySlip] = usePrintPaySlipMutation();
//     const { toast } = useToast();
//     const [isOpen, setIsOpen] = useState(false);

//     if (isLoading || employee_loading || payroll_loading) {
//         return <Loader />;
//     }

//     if (error) {
//         return <p className='text-[#722f37]'>Something went wrong</p>;
//     }

//     const result = data?.userPrincipalName;
//     const getEmpNo = employee_list?.value.find((e) => e.Company_E_Mail === result);
//     const resultEmpNo = getEmpNo?.No;

//     const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//         console.log('submitting form with values', values);

//         try {
//             const res = await submitPaySlip(values).unwrap();
//             const base64String = res.value;
//             const cleanedResponse = base64String.replace(/(\r\n|\n|\r)/gm, "");

//             const byteCharacters = atob(cleanedResponse);
//             const byteNumbers = new Array(byteCharacters.length);
//             for (let i = 0; i < byteCharacters.length; i++) {
//                 byteNumbers[i] = byteCharacters.charCodeAt(i);
//             }
//             const byteArray = new Uint8Array(byteNumbers);
//             const blob = new Blob([byteArray], { type: 'application/pdf' });

//             // Create a URL for the PDF and open it in a new tab/window
//             const pdfPreviewUrl = URL.createObjectURL(blob);

//             // Open the PDF in a new tab/window
//             const newTab = window.open(pdfPreviewUrl, '_blank');
//             if (!newTab) {
//                 toast({
//                     title: "Error",
//                     description: "Pop-up blocked! Please allow pop-ups for this site.",
//                     variant: "destructive"
//                 });
//             } else {
//                 newTab.focus();
//             }

//             setSubmitting(false);
//             toast({
//                 title: "Success",
//                 description: 'Payslip previewed successfully!',
//             });
//             setIsOpen(false);

//         } catch (err) {
//             setSubmitting(false);
//             if (err && err?.data?.error?.message) {
//                 toast({
//                     title: "Error",
//                     description: err?.data?.error?.message,
//                     variant: "destructive"
//                 });
//             } else {
//                 toast({
//                     title: "Error",
//                     description: "Something went wrong",
//                     variant: "destructive"
//                 });
//             }
//         }
//     };

//     return (
//         <div>
//             <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                 <DialogTrigger asChild>
//                     <Button variant="ghost">
//                         <p className='flex items-center gap-2'> <FaPaypal /> View payslip</p>
//                     </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-sm w-full mx-auto">
//                     <DialogHeader>
//                         <DialogTitle>
//                             View your payslip
//                         </DialogTitle>
//                     </DialogHeader>
//                     <Formik
//                         initialValues={{
//                             employeeNo: `${resultEmpNo}`,
//                             periodDate: ''
//                         }}
//                         validate={(values) => {
//                             const errors = {};
//                             if (!values.periodDate) {
//                                 errors.periodDate = 'Period date is empty!';
//                             }
//                             return errors;
//                         }}
//                         onSubmit={handleSubmit}
//                     >
//                         {({
//                             values,
//                             errors,
//                             touched,
//                             handleChange,
//                             handleBlur,
//                             handleSubmit,
//                             isSubmitting,
//                         }) => (
//                             <form onSubmit={handleSubmit}>
//                                 <div className="grid gap-4 py-2">
//                                     <div className='grid-cols-4 items-center gap-4 relative'>
//                                         <Label htmlFor="employeeNo" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>
//                                             Employee No
//                                         </Label>
//                                         <Input
//                                             type='text'
//                                             name="employeeNo"
//                                             id="employeeNo"
//                                             value={values.employeeNo}
//                                             readOnly
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="grid gap-4 py-2">
//                                     <div className='grid-cols-4 items-center gap-4 relative'>
//                                         <Label htmlFor="periodDate" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>
//                                             Period Date
//                                         </Label>
//                                         <select
//                                             name="periodDate"
//                                             id="periodDate"
//                                             value={values.periodDate}
//                                             onChange={handleChange}
//                                             onBlur={handleBlur}
//                                             className='p-2 w-full outline-none dark:bg-slate-800 border border-solid  border-slate-300 text-gray-500 h-12 bg-transparent'
//                                         >
//                                             <option>{payroll_loading ? 'Loading...' : 'Select a date'}</option>
//                                             {payrolldate?.value?.map((payroll, i) => (
//                                                 <option key={i} value={payroll.Date_Opened}>
//                                                     {payroll.Date_Opened}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {touched.periodDate && errors.periodDate ? (
//                                             <div className='text-red-500 pl-2 text-sm font-semibold'>{errors.periodDate}</div>
//                                         ) : null}
//                                     </div>
//                                 </div>
//                                 <div className='w-full h-12 my-4'>
//                                     <button type="submit" className={`bg-[#722f37] w-full text-white rounded-lg py-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
//                                         {isSubmitting ? 'Processing...' : 'Generate'}
//                                     </button>
//                                 </div>
//                             </form>
//                         )}
//                     </Formik>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     );
// }

// export default DialogPaySlip;

// import React, { useState } from 'react';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { useGetProfilesQuery } from '../slices/profileApiSlice';
// import Loader from '@/app/utils/Loader';
// import { useGetEmployeesQuery, usePayrollDateQuery, usePrintPaySlipMutation } from '../slices/usersApiSlice';
// import { Formik } from 'formik';
// import { FaPaypal } from "react-icons/fa";
// import { useToast } from '@/components/ui/use-toast';

// const DialogPaySlip = () => {
//     const { data, isLoading, error } = useGetProfilesQuery();
//     const { data: employee_list, isLoading: employee_loading, error: isError } = useGetEmployeesQuery();
//     const { data: payrolldate, isLoading: payroll_loading, error: payrollerror } = usePayrollDateQuery();
//     const [submitPaySlip] = usePrintPaySlipMutation();
//     const { toast } = useToast();
//     const [isOpen, setIsOpen] = useState(false);
//     const [pdfUrl, setPdfUrl] = useState(null); // Local state to store the PDF URL

//     if (isLoading || employee_loading || payroll_loading) {
//         return <Loader />;
//     }

//     if (error) {
//         return <p className='text-[#722f37]'>Something went wrong</p>;
//     }

//     const result = data?.userPrincipalName;
//     const getEmpNo = employee_list?.value.find((e) => e.Company_E_Mail === result);
//     const resultEmpNo = getEmpNo?.No;

//     const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//         console.log('submitting form with values', values);

//         try {
//             const res = await submitPaySlip(values).unwrap();
//             const base64String = res.value;
//             const cleanedResponse = base64String.replace(/(\r\n|\n|\r)/gm, "");

//             const byteCharacters = atob(cleanedResponse);
//             const byteNumbers = new Array(byteCharacters.length);
//             for (let i = 0; i < byteCharacters.length; i++) {
//                 byteNumbers[i] = byteCharacters.charCodeAt(i);
//             }
//             const byteArray = new Uint8Array(byteNumbers);
//             const blob = new Blob([byteArray], { type: 'application/pdf' });

//             // Create a URL for the PDF
//             const pdfPreviewUrl = URL.createObjectURL(blob);
//             setPdfUrl(pdfPreviewUrl); // Set the PDF URL in local state

//             setSubmitting(false);
//             toast({
//                 title: "Success",
//                 description: 'Payslip previewed successfully!',
//             });
//             setIsOpen(false);

//         } catch (err) {
//             setSubmitting(false);
//             if (err && err?.data?.error?.message) {
//                 toast({
//                     title: "Error",
//                     description: err?.data?.error?.message,
//                     variant: "destructive"
//                 });
//             } else {
//                 toast({
//                     title: "Error",
//                     description: "Something went wrong",
//                     variant: "destructive"
//                 });
//             }
//         }
//     };

//     return (
//         <div>
//             <Dialog open={isOpen} onOpenChange={setIsOpen}>
//                 <DialogTrigger asChild>
//                     <Button variant="ghost">
//                         <p className='flex items-center gap-2'> <FaPaypal /> View payslip</p>
//                     </Button>
//                 </DialogTrigger>
//                 <DialogContent className="max-w-sm w-full mx-auto">
//                     <DialogHeader>
//                         <DialogTitle>
//                             View your payslip
//                         </DialogTitle>
//                     </DialogHeader>
//                     <Formik
//                         initialValues={{
//                             employeeNo: `${resultEmpNo}`,
//                             periodDate: ''
//                         }}
//                         validate={(values) => {
//                             const errors = {};
//                             if (!values.periodDate) {
//                                 errors.periodDate = 'Period date is empty!';
//                             }
//                             return errors;
//                         }}
//                         onSubmit={handleSubmit}
//                     >
//                         {({
//                             values,
//                             errors,
//                             touched,
//                             handleChange,
//                             handleBlur,
//                             handleSubmit,
//                             isSubmitting,
//                         }) => (
//                             <form onSubmit={handleSubmit}>
//                                 <div className="grid gap-4 py-2">
//                                     <div className='grid-cols-4 items-center gap-4 relative'>
//                                         <Label htmlFor="employeeNo" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>
//                                             Employee No
//                                         </Label>
//                                         <Input
//                                             type='text'
//                                             name="employeeNo"
//                                             id="employeeNo"
//                                             value={values.employeeNo}
//                                             readOnly
//                                         />
//                                     </div>
//                                 </div>
//                                 <div className="grid gap-4 py-2">
//                                     <div className='grid-cols-4 items-center gap-4 relative'>
//                                         <Label htmlFor="periodDate" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>
//                                             Period Date
//                                         </Label>
//                                         <select
//                                             name="periodDate"
//                                             id="periodDate"
//                                             value={values.periodDate}
//                                             onChange={handleChange}
//                                             onBlur={handleBlur}
//                                             className='p-2 w-full outline-none dark:bg-slate-800 border border-solid  border-slate-300 text-gray-500 h-12 bg-transparent'
//                                         >
//                                             <option>{payroll_loading ? 'Loading...' : 'Select a date'}</option>
//                                             {payrolldate?.value?.map((payroll, i) => (
//                                                 <option key={i} value={payroll.Date_Opened}>
//                                                     {payroll.Date_Opened}
//                                                 </option>
//                                             ))}
//                                         </select>
//                                         {touched.periodDate && errors.periodDate ? (
//                                             <div className='text-red-500 pl-2 text-sm font-semibold'>{errors.periodDate}</div>
//                                         ) : null}
//                                     </div>
//                                 </div>
//                                 <div className='w-full h-12 my-4'>
//                                     <button type="submit" className={`bg-[#722f37] w-full text-white rounded-lg py-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
//                                         {isSubmitting ? 'Processing...' : 'Generate'}
//                                     </button>
//                                 </div>
//                             </form>
//                         )}
//                     </Formik>
//                 </DialogContent>
//             </Dialog>

//             {/* Display the PDF outside the dialog */}
//             {pdfUrl && (
//                 <div className="pdf-preview-container mt-4">
//                     <iframe
//                         src={pdfUrl}
//                         title="PDF Preview"
//                         width="100%"
//                         height="500px"
//                         frameBorder="0"
//                     ></iframe>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default DialogPaySlip;

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGetProfilesQuery } from '../slices/profileApiSlice';
import Loader from '@/app/utils/Loader';
import { useGetEmployeesQuery, usePayrollDateQuery, usePrintPaySlipMutation } from '../slices/usersApiSlice';
import { Formik } from 'formik';
import { FaPaypal } from "react-icons/fa";
import { useToast } from '@/components/ui/use-toast';

const DialogPaySlip = () => {
    const { data, isLoading, error } = useGetProfilesQuery();
    const { data: employee_list, isLoading: employee_loading, error: isError } = useGetEmployeesQuery();
    const { data: payrolldate, isLoading: payroll_loading, error: payrollerror } = usePayrollDateQuery();
    const [submitPaySlip] = usePrintPaySlipMutation();
    const { toast } = useToast();
    const [isOpen, setIsOpen] = useState(false);
    const [pdfUrl, setPdfUrl] = useState(null); // Local state to store the PDF URL

    if (isLoading || employee_loading || payroll_loading) {
        return <Loader />;
    }

    if (error) {
        return <p className='text-[#722f37]'>Something went wrong</p>;
    }

    const result = data?.userPrincipalName;
    const getEmpNo = employee_list?.value.find((e) => e.Company_E_Mail === result);
    const resultEmpNo = getEmpNo?.No;

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        console.log('submitting form with values', values);

        try {
            const res = await submitPaySlip(values).unwrap();
            const base64String = res.value;
            const cleanedResponse = base64String.replace(/(\r\n|\n|\r)/gm, "");

            const byteCharacters = atob(cleanedResponse);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'application/pdf' });

            // Create a URL for the PDF
            const pdfPreviewUrl = URL.createObjectURL(blob);
            setPdfUrl(pdfPreviewUrl); // Set the PDF URL in local state

            setSubmitting(false);
            toast({
                title: "Success",
                description: 'Payslip previewed successfully!',
            });
            setIsOpen(false);

        } catch (err) {
            setSubmitting(false);
            if (err && err?.data?.error?.message) {
                toast({
                    title: "Error",
                    description: err?.data?.error?.message,
                    variant: "destructive"
                });
            } else {
                toast({
                    title: "Error",
                    description: "Something went wrong",
                    variant: "destructive"
                });
            }
        }
    };

    // Handle Cancel PDF preview
    const handleCancelPdf = () => {
        setPdfUrl(null); // Clear the PDF URL
    };

    return (
        <div>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button variant="ghost">
                        <p className='flex items-center gap-2'> <FaPaypal /> View payslip</p>
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm w-full mx-auto">
                    <DialogHeader>
                        <DialogTitle>
                            View your payslip
                        </DialogTitle>
                    </DialogHeader>
                    <Formik
                        initialValues={{
                            employeeNo: `${resultEmpNo}`,
                            periodDate: ''
                        }}
                        validate={(values) => {
                            const errors = {};
                            if (!values.periodDate) {
                                errors.periodDate = 'Period date is empty!';
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
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="grid gap-4 py-2">
                                    <div className='grid-cols-4 items-center gap-4 relative'>
                                        <Label htmlFor="employeeNo" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>
                                            Employee No
                                        </Label>
                                        <Input
                                            type='text'
                                            name="employeeNo"
                                            id="employeeNo"
                                            value={values.employeeNo}
                                            readOnly
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-4 py-2">
                                    <div className='grid-cols-4 items-center gap-4 relative'>
                                        <Label htmlFor="periodDate" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>
                                            Period Date
                                        </Label>
                                        <select
                                            name="periodDate"
                                            id="periodDate"
                                            value={values.periodDate}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            className='p-2 w-full outline-none dark:bg-slate-800 border border-solid  border-slate-300 text-gray-500 h-12 bg-transparent'
                                        >
                                            <option>{payroll_loading ? 'Loading...' : 'Select a date'}</option>
                                            {payrolldate?.value?.map((payroll, i) => (
                                                <option key={i} value={payroll.Date_Opened}>
                                                    {payroll.Date_Opened}
                                                </option>
                                            ))}
                                        </select>
                                        {touched.periodDate && errors.periodDate ? (
                                            <div className='text-red-500 pl-2 text-sm font-semibold'>{errors.periodDate}</div>
                                        ) : null}
                                    </div>
                                </div>
                                <div className='w-full h-12 my-4'>
                                    <button type="submit" className={`bg-[#722f37] w-full text-white rounded-lg py-4 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={isSubmitting}>
                                        {isSubmitting ? 'Processing...' : 'Generate'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </DialogContent>
            </Dialog>

            {/* Display the PDF outside the dialog */}
            {pdfUrl && (
                <div className="pdf-preview-container mt-4">
                    <iframe
                        src={pdfUrl}
                        title="PDF Preview"
                        width="100%"
                        height="500px"
                        frameBorder="0"
                    ></iframe>
                    <Button onClick={handleCancelPdf} className="mt-2 bg-red-500 text-white">
                        Cancel Preview
                    </Button>
                </div>
            )}
        </div>
    );
}

export default DialogPaySlip;
