import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

 const graphbaseQuery = fetchBaseQuery({
    baseUrl:'/',
    prepareHeaders: async (headers, {getState}) =>{
        const state = getState()
        const accessTokens = state.auth.graphAccessToken;
        console.log('yeah:',accessTokens)
        if(accessTokens) {
            headers.set('Authorization', `Bearer ${accessTokens}`)
        }

        return headers;
    }
})

export const profileSlice = createApi({
    reducerPath:"profileApi",
    baseQuery:graphbaseQuery,
    tagTypes:['me'],
    endpoints:(builder) =>({

    })
})