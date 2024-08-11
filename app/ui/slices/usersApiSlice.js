import { apiSlice } from "./apiSlice"; 
import {fetchBaseQuery} from '@reduxjs/toolkit/query/react'


const ENDPOINT="https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')"
//https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HRLeaveApplicationCard
//https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HRLeaveApplicationsList
//https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/ComplaintFormListPage
//https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HRCardPageAPI


export const employeeApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        getResponsibilityCenter:builder.query({
            query:() =>`${ENDPOINT}/ResponsibilityCenterList`,
            providesTags:['Employee'],
        }),
        getLeavePeriod:builder.query({
            query:() =>`${ENDPOINT}/HRLeavePeriodList`,
            providesTags:['LeavePeriod']
        }),
        getLeaveTypes:builder.query({
            query:() => `${ENDPOINT}/HrLeaveTypes`,
            providesTags:['LeaveTypes']
        }),
        getEmployees:builder.query({
            query:() =>`${ENDPOINT}/HREmployeeList`,
            providesTags:['EmployeesList']
        }),
        getLeave:builder.query({
            query:() =>`${ENDPOINT}/HRLeaveApplicationsList`,
            providesTags:['LeaveHistory']
        }),
        complaint:builder.mutation({
            query:(data) =>({
                url:`${ENDPOINT}/ComplaintFormCard`,
                method:'POST',
                body:data
            })
        }),
        downloadPdf:builder.mutation({
            query:(data)=>({
             url:'https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/paySlipInteg_GetPaySlip?Company=9981f8b7-081c-ec11-bb75-000d3a2200ea',
             method:'POST',
             body:data
            })
        }),
        leave:builder.mutation({
            query:(data) =>({
                url:`${ENDPOINT}/HRLeaveApplicationCard`,
                method:'POST',
                body:data
            })
        }),
        employeeCard:builder.query({
            query:(employeeId) =>`${ENDPOINT}/HRCardPageAPI('${employeeId}')`,
            providesTags:['EmployeeCard']
        }),
        complaintListPage:builder.query({
            query:() => `${ENDPOINT}/ComplaintFormListPage`,
            providesTags:['complaintListPage']
        })

       
    }),
    overrideExisting: true,
})

export const { useComplaintMutation, useDownloadPdfMutation, useComplaintListPageQuery, useLeaveMutation, useGetResponsibilityCenterQuery, useGetLeavePeriodQuery, useGetLeaveTypesQuery, useGetEmployeesQuery, useGetLeaveQuery, useEmployeeCardQuery} = employeeApiSlice