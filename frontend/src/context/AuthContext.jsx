import { createContext, useContext, useState } from "react";



const authContext=createContext(null)

const AuthProvider=({children})=>{
    const [token,setToken]=useState(false)
    
   
    const contextValue={
      token,setToken
    }

    return(
        <authContext.Provider value={contextValue}>{children}</authContext.Provider>
    )
}

const useAuth=()=>useContext(authContext)

export {AuthProvider,useAuth}