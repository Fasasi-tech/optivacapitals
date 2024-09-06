import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react'
import { msalInstance } from '@/app/redux/msalConfig'
import { setAuthState, logout } from './authSlice'

const baseQuery = fetchBaseQuery({
    baseUrl: '/',
    // prepareHeaders: async(headers, {getState}) =>{
    //     const state = getState()
    //     const accessToken = state.auth.accessToken;
      
    //      if (accessToken){
    //         headers.set('Authorization', `Bearer ${accessToken}`);}
        

    //     return headers;
    // }
    })
   
   
    

export const apiSlice = createApi({
    reducerPath:'employeeApi',
     baseQuery,
    tagTypes: [ 'Employee','payrollDate', 'postedLeave','acknowledgement-history', 'EmployeeCard','payroll', 'PaySlipCard', 'LeavePeriod', 'LeaveTypes', 'EmployeesList', 'LeaveHistory', 'complaintListPage'],  //automated re-fetching
    endpoints: (builder) => ({

    })
})