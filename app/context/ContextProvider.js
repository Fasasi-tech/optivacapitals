'use client'

import React, {createContext, useContext, useState, useEffect} from 'react';
const StateContext = createContext()

const isBrowser = typeof window !== "undefined"; 
const initialOpenState = isBrowser ? localStorage.getItem("sidebarOpen") === "false" : false;

export const ContextProvider =({children}) =>{
      
    const [open, setOpen] = useState(initialOpenState);

    useEffect(() => {
        localStorage.setItem("sidebarOpen", open.toString());
      }, [open]);
      
      useEffect(() => {
        setOpen(localStorage.getItem("sidebarOpen") === "false");
      }, []);

      return(
        <StateContext.Provider value={{open, setOpen}}>
            {children}
        </StateContext.Provider>
      )
}

export const useStateContext = () => useContext(StateContext)