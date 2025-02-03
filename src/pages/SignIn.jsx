import { Box } from "@mui/material"
import { Helmet } from "react-helmet"
import WhoAmI from "../components/SignIn/WhoAmI"
import { Route, Routes } from "react-router-dom"
import EmployeeSignInForm from "../components/SignIn/EmployeeSignInForm"
import ManagerSignInForm from "../components/SignIn/ManagerSignInForm"

const SignIn = () => {
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
