import { Box } from "@mui/material"
import { Helmet } from "react-helmet"
import WhoAmI from "../components/SignIn/WhoAmI"
import { Route, Routes } from "react-router-dom"

const SignIn = () => {
  return (
    <>
    <Helmet>
      <title>Sign In | FTS HRMS</title>
      <meta name="description" content="Sign in to Full Stack Tech Solutions HRMS" />
    </Helmet>
    <Routes>
      <Route path="/" element={<WhoAmI />} />
      {/* <Route path="/about-us" element={<AboutUs />} /> */}
      {/* <Route path="/contact-us" element={<ContactUs />} /> */}
    </Routes>
    </>
  )
}

export default SignIn
