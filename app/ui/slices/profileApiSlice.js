import { profileSlice } from "./profileSlice";


const EMPLOYEE_ENDPOINT='https://graph.microsoft.com/v1.0';

export const bcProfileApiSlice = profileSlice.injectEndpoints({
    endpoints:(builder) => ({
        getProfiles:builder.query({
            query:() =>`${EMPLOYEE_ENDPOINT}/me`,
            providesTags:['me'],
         
        }),
        Profile:builder.mutation({
            query:(data)=>({
                url:`${EMPLOYEE_ENDPOINT}/me`,
                method:"PATCH",
                body:data
            })
        })
    }),
    overrideExisting: true,
})

export const {useGetProfilesQuery, useProfileMutation}=bcProfileApiSlice