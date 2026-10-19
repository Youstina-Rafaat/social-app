import { Navigate} from "react-router-dom"
import type { ReactNode } from "react"


export default function ProtectedRoute({children}:{children :ReactNode}) {
    if(!localStorage.getItem("userToken")){
        return <Navigate to={"/login"}/>
    }
    else{
        return <>{ children}</>
    }
}
