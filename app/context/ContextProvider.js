'use client'

import React, {createContext, useContext, useState, useEffect} from 'react';
const StateContext = createContext()

const isBrowser = typeof window !== "undefined"; 
const initialOpenState = isBrowser ? localStorage.getItem("sidebarOpen") === "true" : true;

export const ContextProvider =({children}) =>{
      
    const [open, setOpen] = useState(initialOpenState);
    const [screenSize, setScreenSize] = useState(undefined)

    useEffect(() => {
        localStorage.setItem("sidebarOpen", open.toString());
      }, [open]);
      
      useEffect(() => {
        setOpen(localStorage.getItem("sidebarOpen") === "false");
      }, []);

      return(
        <StateContext.Provider value={{open, setOpen, screenSize, setScreenSize}}>
            {children}
        </StateContext.Provider>
      )
}

export const useStateContext = () => useContext(StateContext)