import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Layout from "./Layout/Layout"
import Home from "./Pages/Home/Home"
import Login from "./Pages/Login/Login"
import Register from "./Pages/Register/Register"
import Profile from "./Pages/Profile/Profile"
import AuthContextProvider from "./Context/AuthContext"
import {QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./Pages/PostDetails/PostDetails"
import { Toaster } from 'react-hot-toast';
import Offline from "./Components/Offline/Offline"
import {useNetworkState} from 'react-use';
function App() {
  const {online} =useNetworkState()
 const query=new QueryClient()
const routers=createBrowserRouter([{
  path:"",element:<Layout/>,
  children:[{
    path:"home",element:<Home/>
  },
  {
    index:true,element:<Home/>
  },
    {
    path:"profile",element:<Profile/>
  },
    {
    path:"postdetails/:id",element:<PostDetails/>
  },
]
},{path:"login",element:<Login/>},
    {path:"register",element:<Register/>}])
  return (
    <>
    {!online &&<Offline/>}
    <QueryClientProvider client={query}>
      <AuthContextProvider>
        <Toaster/>
        <RouterProvider router={routers}></RouterProvider>
      </AuthContextProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
