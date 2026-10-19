import { createContext, useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode"
export const AuthContext = createContext()
export default function AuthContextProvider({children}){
    const [userLogin, setUserLogin] = useState(function(){
        return localStorage.getItem("userToken")
    })
    const [userId, setuserId] = useState("")
    useEffect(()=>{
        if(localStorage.getItem("userToken")){
            const{user}=jwtDecode(localStorage.getItem("userToken"))
            setuserId(user)
        }
    },[userLogin])
    return <AuthContext.Provider value={ {userLogin ,setUserLogin,userId}}>
        {children}
    </AuthContext.Provider>
}