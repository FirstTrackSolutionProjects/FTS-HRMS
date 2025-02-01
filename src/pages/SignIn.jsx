import { Box } from "@mui/material"
import SignInLayout from "../components/SignIn/SignInLayout"
import { Helmet } from "react-helmet"
import WhoAmI from "../components/SignIn/WhoAmI"

const SignIn = () => {
  return (
    <>
    <Helmet>
      <title>Sign In | FTS HRMS</title>
      <meta name="description" content="Sign in to Full Stack Tech Solutions HRMS" />
    </Helmet>
    {/* <SignInLayout /> */}
    <WhoAmI />
    </>
  )
}

export default SignIn
