import { Box } from "@mui/material"
import { Helmet } from "react-helmet"
import WhoAmI from "../components/SignIn/WhoAmI"
import { Route, Routes, useNavigate } from "react-router-dom"
import EmployeeSignInForm from "../components/SignIn/EmployeeSignInForm"
import ManagerSignInForm from "../components/SignIn/ManagerSignInForm"
import { useAuth } from "../contexts/AuthContext"
import { useEffect } from "react"

const SignIn = () => {
  const { isAuthenticated, is_manager } = useAuth()
  const navigate = useNavigate()
  useEffect(()=>{
    if(isAuthenticated){
      if(is_manager) navigate('/admin-dashboard')
      else navigate('/employee-dashboard')
    }
  },[isAuthenticated])
  return (
    <>
    <Helmet>
      <title>Sign In | FTS HRMS</title>
      <meta name="description" content="Sign in to Full Stack Tech Solutions HRMS" />
    </Helmet>
    <Routes>
      <Route path="/" element={<WhoAmI />} />
      <Route path="/employee" element={<EmployeeSignInForm />} />
      <Route path="/admin" element={<ManagerSignInForm />} />
    </Routes>
    </>
  )
}

export default SignIn
