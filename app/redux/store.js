import {configureStore} from '@reduxjs/toolkit';

import authReducer from '../ui/slices/authSlice'
import { apiSlice } from '../ui/slices/apiSlice';
import { profileSlice } from '../ui/slices/profileSlice';
export const store = configureStore({
    reducer: {
        auth: authReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [profileSlice.reducerPath]:profileSlice.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware, profileSlice.middleware),
    devTools:true,
    serializableCheck: false, 
})


export default store;