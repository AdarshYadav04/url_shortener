import { createContext, useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


const authContext=createContext(null)

const AuthProvider=({children})=>{
    const [token,setToken]=useState(false)
    const navigate=useNavigate()
    
    const contextValue={
      token,setToken
    }

    return(
        <authContext.Provider value={contextValue}>{children}</authContext.Provider>
    )
}

const useAuth=()=>useContext(authContext)

export {AuthProvider,useAuth}