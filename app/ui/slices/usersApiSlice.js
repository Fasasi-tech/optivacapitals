import { apiSlice } from "./apiSlice"; 
import {fetchBaseQuery} from '@reduxjs/toolkit/query/react'


const ENDPOINT="https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')"
//https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HRLeaveApplicationCard
//https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HRLeaveApplicationsList
//https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/ComplaintFormListPage
//https://api.businesscentral.dynamics.com/v2.0/1a138626-759e-4827-97f1-b49b7fd4caef/OPTIVA_API/ODataV4/Company('My%20Company')/HRCardPageAPI
const backendEndPoint ="https://optiva-leave-cab8779527d7.herokuapp.com/api/v1/employees"

export const employeeApiSlice = apiSlice.injectEndpoints({
    endpoints:(builder) => ({
        getResponsibilityCenter:builder.query({
            query:() =>`${ENDPOINT}/ResponsibilityCenterList`,
            providesTags:['Employee'],
        }),
        getLeavePeriod:builder.query({
            query:() =>`${backendEndPoint}/leavePeriods`,
            providesTags:['LeavePeriod']
        }),
        getLeaveTypes:builder.query({
            query:() => `${backendEndPoint}/leaveTypes`,
            providesTags:['LeaveTypes']
        }),
        getEmployees:builder.query({
            query:() =>backendEndPoint,
            providesTags:['EmployeesList']
        }),
        getLeave:builder.query({
            query:() =>`${backendEndPoint}/history`,
            providesTags:['LeaveHistory']
        }),
        postedLeave:builder.query({
            query:() =>`${backendEndPoint}/postedleave`,
            providesTags:['postedLeave']
        }),
        acknowledgementHistory:builder.query({
            query:() =>`${backendEndPoint}/acknowledgement-history`,
            providesTags:['acknowledgement-history']
        }),

        complaint:builder.mutation({
            query:(data) =>({
                url:`${backendEndPoint}/complaint`,
                method:'POST',
                body:data
            })
        }),
        downloadPdf:builder.mutation({
            query:(data)=>({
             url:backendEndPoint,
             method:'POST',
             body:data
            })
        }),
        leaves:builder.mutation({
            query:(data) =>({
                url:`${backendEndPoint}/leave`,
                method:'POST',
                body:data
            })
        }),
        acknowledgement:builder.mutation({
            query:(data) =>({
                url:`${backendEndPoint}/acknowledgement`,
                method:'POST',
                body:data
            })
        }),
        printPaySlip:builder.mutation({
            query:(data) =>({
                url:`${backendEndPoint}`,
                method:'POST',
                body:data
            })
        }),
        picture:builder.mutation({
            query:(data) =>({
                url:`${backendEndPoint}/picture`,
                method:'POST',
                body:data
            })
        }),
        employeeCard:builder.query({
            query:(employeeId) =>`${backendEndPoint}/card/${employeeId}`,
            providesTags:['EmployeeCard']
        }),
        payslipCard:builder.query({
            query:(employeeId) =>`${backendEndPoint}/payslip/${employeeId}`,
            providesTags:['PaySlipCard']
        }),
        complaintListPage:builder.query({
            query:() => `${backendEndPoint}/complaint`,
            providesTags:['complaintListPage']
        }),
        payroll:builder.query({
            query:() => `${backendEndPoint}/payroll`,
            providesTags:['payroll']
        }),
        payrollDate:builder.query({
            query:() => `${backendEndPoint}/payrollDate`,
            providesTags:['payrollDate']
        })

       
    }),
    overrideExisting: true,
})

export const { useComplaintMutation,usePostedLeaveQuery,usePictureMutation, useAcknowledgementHistoryQuery, usePrintPaySlipMutation, usePayrollDateQuery, usePayrollQuery,usePayslipCardQuery, useDownloadPdfMutation, useComplaintListPageQuery, useLeavesMutation, useGetResponsibilityCenterQuery, useGetLeavePeriodQuery, useGetLeaveTypesQuery, useGetEmployeesQuery, useGetLeaveQuery, useAcknowledgementMutation, useEmployeeCardQuery} = employeeApiSlice