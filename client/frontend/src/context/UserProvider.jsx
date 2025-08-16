import React, { Children, useState } from "react";
import { createContext } from "react";
export const UserContext = createContext();

export const UserProvider = ({children})=>{
    const [userData,setuserData] = useState(null);
    
    return(
        <UserContext.Provider value={{userData,setuserData}}>
            {children}
        </UserContext.Provider>
    )
}