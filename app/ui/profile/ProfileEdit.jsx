'use client'
import React, {useState, useEffect} from 'react'
import Loader from '@/app/utils/Loader';
import { useGetProfilesQuery } from '../slices/profileApiSlice';
import { useDownloadPdfMutation, useEmployeeCardQuery, useGetEmployeesQuery, usePictureMutation } from '../slices/usersApiSlice';
import banner from './../../../app/../public/banner.png'
import Image from 'next/image';
import { SiJirasoftware } from "react-icons/si";
import { FaLocationDot } from "react-icons/fa6";
import { FaRegCalendarAlt } from "react-icons/fa";
import { Input } from '@/components/ui/input';
import { FaUserAlt } from "react-icons/fa";
import { FaPhoneAlt } from "react-icons/fa";
import { GoDotFill } from "react-icons/go";
import { useComplaintListPageQuery } from '../slices/usersApiSlice';
import { MdOutlineReportProblem } from "react-icons/md";
import Link from 'next/link';

const ProfileEdit = () => {

    const [add, setAdd] = useState(null);

    const {data:getReliever, isLoading:loadingReliever, error:loadingError} = useGetProfilesQuery()
    const {data:employee_list, isLoading:employee_list_loading, error:employee_list_error} = useGetEmployeesQuery()
    const { data, isLoading, error } = useEmployeeCardQuery(add ? `${add}` : '', {
        skip: !add, // Skip the query if add is not set
      });

      const {data:complaint, isLoading:complaint_Loading, error:complaint_error} = useComplaintListPageQuery()
      const {data:profileData, isLoading:HistoryLoading, error:errorLoading} = useGetProfilesQuery()

  
      const value=complaint?.value
      const findCompanyEmail = profileData?.userPrincipalName;
      const [imageSrc, setImageSrc] = useState(null);
      const [fetchBase64Image] = usePictureMutation()

      const complaintResult = value?.filter((i) => i.Company_Email === findCompanyEmail)
      const complaintResult2 = complaintResult?.filter((r) => r.Status ==='Closed')

      const lengths = complaintResult2?.length

      useEffect(() => {
        if (employee_list && getReliever) {
          const generateReliever = getReliever?.userPrincipalName;
          const response = employee_list.value.find(val => generateReliever === val.Company_E_Mail);

          if (response) {
            setAdd(response.No);
            // setAdd('OCP00101')
          }
        }
      }, [employee_list, getReliever]);

      // useEffect(() => {
      //   const handleFetchImage = async () => {
      //     if (data && data.No) {  
      //       try {
      //         const payload = { employeeNo: data.No };
      //         const response = await fetchBase64Image(payload).unwrap();
      //         const dataUrl = response.value ?`data:image/jpeg;base64,${response.value}` : null;
      //         setImageSrc(dataUrl);
      //       } catch (error) {
      //         console.error('Error fetching image:', error);
      //       }
      //     }
      //   };
      
      //   handleFetchImage(); 
       
      // }, [data, fetchBase64Image]);

    
  // useEffect(() => {
  //   const handleFetchImage = async () => {
  //     if (data && data.No) {
  //       try {
  //         const payload = { employeeNo: data.No };
  //         const response = await fetchBase64Image(payload).unwrap();

  //         // Validate if response.value is a valid Base64 string (a basic check)
  //         if (response?.value && response.value.startsWith('/9j/') /* Basic JPEG header */) {
  //           const dataUrl = `data:image/jpeg;base64,${response.value}`;
  //           console.log(dataUrl, 'dataurl')
  //           setImageSrc(dataUrl);
  //         } else {
  //           // Handle invalid image data
  //           setImageSrc(null);
  //         }
  //       } catch (error) {
  //         console.error('Error fetching image:', error);
  //         setImageSrc(null); // Ensure we reset imageSrc on error
  //       }
  //     }
  //   };

  //   handleFetchImage();
  // }, [data, fetchBase64Image]);

  useEffect(() => {
    const handleFetchImage = async () => {
      if (data && data.No) {
        try {
          const payload = { employeeNo: data.No };
          const response = await fetchBase64Image(payload).unwrap();
  
          // Check if the response contains a valid Base64 value
          if (response?.value) {
            // Assuming the backend is returning a Base64 encoded image
            const dataUrl = `data:image/jpeg;base64,${response.value}`;
            console.log(dataUrl, 'dataurl');
            setImageSrc(dataUrl);
          } else {
            // Handle cases where the image data is missing or invalid
            console.error('Invalid image data received');
            setImageSrc(null);
          }
        } catch (error) {
          console.error('Error fetching image:', error);
          setImageSrc(null); // Reset imageSrc on error
        }
      }
    };
  
    handleFetchImage();
  }, [data, fetchBase64Image]);
  

      console.log(imageSrc, 'imageSrc')
      
      
  
    if(isLoading || loadingReliever || employee_list_loading){
        return <Loader />
    }

   
    if (error ||loadingError || employee_list_error){
        return <div className='text-[#722f37]'>oops, error fetching data</div>
    }

    
    if(complaint_Loading || HistoryLoading){
      return <Loader />
    }

    console.log(data, 'datum')
    const f_name= data?.first_name.slice(0,1).toUpperCase()
    const l_names=data?.last_name.slice(0,1).toUpperCase()
    const d= new Date(data?.date_of_joining)
    const d_o_b= new Date(data?.d_o_b)
    const date1= d_o_b
    const date2 = new Date()
    const d_o_j= new Date(data?.date_of_joining)
    const probationDate = new Date(data?.Probation_Date_3mnths)
    const confirmationDate = new Date(data?.Confirmation_Date)

    const formatDateWithCommas = (date) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const dateString = date.toLocaleDateString('en-US', options);
    
    // Ensure the format is correct by splitting and joining
    const dateParts = dateString.split(' ');
    return `${dateParts[0]}, ${dateParts[1].replace(',', '')}, ${dateParts[2]}`;
  };

    const calculateDateDifference = (startDate, endDate) => {
      let years = endDate.getFullYear() - startDate.getFullYear();
      let months = endDate.getMonth() - startDate.getMonth();
      let days = endDate.getDate() - startDate.getDate();
  
      // Adjust if the end day is less than the start day
      if (days < 0) {
          months -= 1;
          const previousMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 0);
          days += previousMonth.getDate();
      }
  
      // Adjust if the end month is less than the start month
      if (months < 0) {
          years -= 1;
          months += 12;
      }
  
      return `${years} Years, ${months} Months, and ${days} Days`;
  };
    


  return (
    <div className='relative'>
         <div className=" rounded-lg shadow-md bg-white dark:bg-slate-800 w-full mb-4  h-[28rem] md:h-[22rem] lg:h-[20rem]">
            <div className='flex flex-col  items-center '>
                <div className=" bg-cover bg-center">
                    <Image
                        alt="banner"
                        src={banner}
                        quality={100}
                        style={{
                            objectFit: 'cover',
                          }}
                          className='h-40 rounded-t-lg'

                    />
                </div>
                <div className="w-24 h-24 md:w-40 md:h-40 absolute gap-2 top-32 left-8">
                  {imageSrc ? (
                    <Image
                      alt="profile image"
                      src={imageSrc}
                      className="w-full h-full rounded-md"
                      width={160}
                      height={160}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-[#b4898e] text-white font-bold rounded-md">
                      <p className="text-4xl md:text-6xl rounded-full text-[#722f37] font-serif">
                        {`${f_name}${l_names}`}
                      </p>
                    </div>
                  )}
                </div>


            </div>
            <div className='absolute top-[12rem] left-36 md:left-56  '>
              <h3 className='font-medium text-sm md:text-2xl text-gray-500 flex items-center'>{`${data?.No}`} <GoDotFill /> {' '} {`${data?.first_name.toUpperCase()} ${data?.last_name.toUpperCase()}`}</h3>
              <div className='flex flex-wrap md:flex-nowrap items-center justify-start gap-4 mt-4'>
                <div className=' text-gray-400' >
                      <p className='font-medium text-gray-400 flex gap-2 items-center '><SiJirasoftware /> {`${data?.job_description}`}</p>
                  </div>
                  <div className='flex items-center gap-2 text-gray-400'>
                      <p className='font-medium text-gray-400 flex gap-2 items-center'>< FaPhoneAlt />{`${data?.phone}`}</p>
                  </div>
                  <div className='flex items-center gap-2 text-gray-400'>
                      
                      <p className='font-medium text-gray-400 flex gap-2 items-center'><FaRegCalendarAlt />{`joined ${d.toDateString()}`}</p>
                  </div>
              </div>
            </div>
            {/* <div className='absolute text-gray-400 top-[14rem] lg:top-[12rem] right-0 mt-12 mr-4 lg:mr-8'>
              <Link href='/Complaint-History'>
                <p className='font-medium text-gray-400 flex gap-2 items-center'>
                  Number of complaints: {lengths > 0 ? lengths : 0}
                </p>
              </Link>
            </div> */}
            <div className='text-gray-400 absolute top-[22rem] md:top-[16rem]  lg:top-[12rem] right-0 mt-12 mr-2 md:mr-14 lg:mr-8 flex flex-col items-start lg:items-end'>
              <Link href='/Complaint-History'>
                <p className='font-medium text-gray-400 flex gap-2 items-center text-sm md:text-base'>
                  Number of complaints: <p className='text-[#722f37]'>{`${lengths > 0 ? lengths : 0}`}</p>
                </p>
              </Link>
            </div>

        </div>
        {
            data && (
                <div className="flex flex-start  ">
                    <div className="flex flex-col bg-white dark:bg-slate-800 w-full  px-4   py-12 border rounded-lg border-dashed">
                        <p className="text-[#722f37] font-extrabold border-b border-gray-200" >Profile Details</p>
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
                            <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>First Name</label>
                            <Input
                                type='text'
                                value={data.first_name}
                                placeholder=''
                                readOnly
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                          </div>
                          <div className='h-12 mb-12 w-full'>
                            <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Last Name</label>
                            <Input
                                type='text'
                                value={data.last_name}
                                placeholder=''
                                readOnly
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                          </div>
                          <div className='h-12 mb-12 w-full'>
                            <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Citizenship</label>
                            <Input
                                type='text'
                                value={data.Citizenship}
                                placeholder=''
                                readOnly
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                          </div>
                          <div className='h-12 mb-12 w-full'>
                            <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Leave Status</label>
                            <Input
                                type='text'
                                value={data.leave_status}
                                placeholder=''
                                readOnly
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                          </div>
                          <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>City</label>
                            <Input
                                type='text'
                                value={data.city}
                                placeholder=''
                                readOnly
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                          </div>
                          <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Supervisor</label>
                            <Input
                                type='text'
                                value={data.supervisor}
                                placeholder=''
                                readOnly
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                          </div>
                          <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Department code</label>
                            <Input
                                type='text'
                                value={data.department_code}
                                placeholder=''
                                readOnly
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                          </div>
                          <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Residential Address</label>
                            <Input
                                type='text'
                                value={data.residential_address}
                                placeholder=''
                                readOnly
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                          </div>
                          <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Status</label>
                            <Input
                                type='text'
                                value={data.status}
                                placeholder=''
                                readOnly
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                          </div>

                        </div>
                        <p className="text-[#722f37] font-extrabold border-b border-gray-200 mt-8" >Communication Details</p>
                        <div className='grid lg:grid-cols-2 place-items-center mt-4  gap-x-8'>
                          <div className='h-12 mb-12 w-full'>
                            <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Company Email</label>
                            <Input
                                type='text'
                                value={data.company_email}
                                placeholder=''
                                readOnly
                                className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                            />
                          </div>
                          
                            <div className='h-12 mb-12 w-full'>
                              <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Personal Email</label>
                              <Input
                                  type='text'
                                  value={data.personal_email}
                                  placeholder=''
                                  readOnly
                                  className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                              />
                            </div>
                            <div className='h-12 mb-12 w-full'>
                              <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Phone</label>
                              <Input
                                  type='text'
                                  value={data.phone}
                                  placeholder=''
                                  readOnly
                                  className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                              />
                            </div>
                            
                        </div>
                        <p className="text-[#722f37] font-extrabold border-b border-gray-200 mt-8" >Personal Details</p>
                        <div className='grid lg:grid-cols-2 place-items-center mt-4  gap-x-8'>
                            <div className='h-12 mb-12 w-full'>
                              <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Marital Status</label>
                              <Input
                                  type='text'
                                  value={data.marital_status}
                                  placeholder=''
                                  readOnly
                                  className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                              />
                            </div>
                            <div className='h-12 mb-12 w-full'>
                              <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Gender</label>
                              <Input
                                  type='text'
                                  value={data.gender}
                                  placeholder=''
                                  readOnly
                                  className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                              />
                            </div>
                          </div>
                          <p className="text-[#722f37] font-extrabold border-b border-gray-200 mt-8" >Important Dates</p>
                            <div className='grid lg:grid-cols-2 place-items-center mt-4  gap-x-8'>
                              <div className='h-12 mb-12 w-full'>
                                <label htmlFor="" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Date of birth</label>
                                <Input
                                    type='text'
                                    value={`${formatDateWithCommas(d_o_b)}`}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Date of joining the company</label>
                                <Input
                                    type='text'
                                    value={`${formatDateWithCommas(d_o_j)}`}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Age</label>
                                <Input
                                    type='text'
                                    value={calculateDateDifference(date1, date2)}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Length of service</label>
                                <Input
                                    type='text'
                                    value={calculateDateDifference(d_o_j, date2)}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Probation date</label>
                                <Input
                                    type='text'
                                    value={`${formatDateWithCommas(probationDate)}`}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Confirmation date</label>
                                <Input
                                    type='text'
                                    value={`${formatDateWithCommas(confirmationDate)}`}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                            </div>
                            <p className="text-[#722f37] font-extrabold border-b border-gray-200 mt-8" >Job Details</p>
                            <div className='grid lg:grid-cols-2 place-items-center mt-4  gap-x-8'>
                              <div className='h-12 mb-12 w-full'>
                                <label htmlFor="" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Job Title</label>
                                <Input
                                    type='text'
                                    value={data.job_title}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Job Description</label>
                                <Input
                                    type='text'
                                    value={data.job_description}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                           
                          {/* </div>
                            <div className='grid lg:grid-cols-2 place-items-center mt-4  gap-x-8'> */}
                              <div className='h-12 mb-12 w-full'>
                                <label htmlFor="" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Salary Grade</label>
                                <Input
                                    type='text'
                                    value={data.Salary_Grade}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Salary Step</label>
                                <Input
                                    type='text'
                                    value={data.Salary_Step}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Employee classification</label>
                                <Input
                                    type='text'
                                    value={data.Employee_Classification}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Employment Type</label>
                                <Input
                                    type='text'
                                    value={data.employment_type}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>NHIF NO</label>
                                <Input
                                    type='text'
                                    value={data.nhif_no}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              <div className='h-12 mb-12 w-full'>
                                <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Payroll Filter Group</label>
                                <Input
                                    type='text'
                                    value={data.payroll_filter_group}
                                    placeholder=''
                                    readOnly
                                    className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                                />
                              </div>
                              </div>

                      

                        {/* <p className="text-[#722f37] font-extrabold border-b border-gray-200 mt-8" >Job Details</p>
                        <div className="text-[#989898] pt-4 flex flex-wrap items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans '><span className='font-medium'> </span>Job Title:</p> <p className='break-words'> {data.job_title}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'></span>Job Description:</p> <p>{data.job_description}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'></span>Salary Grade:</p> <p>{data.Salary_Grade}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'></span>Salary Step:</p> <p>{data.Salary_Step}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'></span>Employee Classification:</p> <p>{data.Employee_Classification}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'></span>Employment Type:</p> <p>{data.employment_type}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'> </span>NHIF NO:</p> <p>{data.nhif_no}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'></span>Payroll Filter Group</p> <p>{data.payroll_filter_group}</p></div> */}
                        <p className="text-[#722f37] font-extrabold border-b border-gray-200 mt-8" >Leave Details</p>
                        <div className='grid lg:grid-cols-2 place-items-center mt-4  gap-x-8'>
                            <div className='h-12 mb-12 w-full'>
                              <label htmlFor="Nature_of_Complaint" className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Annual Leave</label>
                              <Input
                                  type='text'
                                  value={data.totai_leave}
                                  placeholder=''
                                  readOnly
                                  className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                              />
                            </div>
                            <div className='h-12 mb-12 w-full'>
                              <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Total Leave Taken</label>
                              <Input
                                  type='text'
                                  value={data.total_leave_taken}
                                  placeholder=''
                                  readOnly
                                  className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                              />
                            </div>
                            <div className='h-12 mb-12 w-full'>
                              <label  className='block text-base mb-2 text-gray-500 pl-2 font-semibold'>Leave Balance</label>
                              <Input
                                  type='text'
                                  value={data.leave_balance}
                                  placeholder=''
                                  readOnly
                                  className='p-2 w-full outline-none dark:bg-slate-800 border border-solid border-slate-300 text-gray-500 h-12 bg-transparent'
                              />
                            </div>
                          </div>
                        {/* <p className="text-[#722f37] font-extrabold border-b border-gray-200 mt-8" >Leave Details</p>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'></span>Annual Leave:</p> <p>{data.totai_leave}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'></span>Total Leave Taken:</p> <p>{data.total_leave_taken}</p></div>
                        <div className="text-[#989898] pt-4 flex items-center gap-2"><p className='flex items-center gap-2 font-medium font-sans'><span className='font-medium'></span> Leave Balance:</p> <p>{data.leave_balance}</p></div> */}

                    </div>

                    
                </div>
            )
        }
       
    </div>
  )
}

export default ProfileEdit