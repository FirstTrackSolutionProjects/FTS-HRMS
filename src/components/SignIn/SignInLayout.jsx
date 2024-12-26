import { Box } from '@mui/material'
import React from 'react'
import ManagerSignInForm from './ManagerSignInForm'
import EmployeeSignInForm from './EmployeeSignInForm'

const SignInLayout = () => {
  return (
    <Box className="flex h-[600px]">
      <Box className="flex-[0.5] relative h-full bg-black text-white">
        <EmployeeSignInForm />
      </Box>
      <Box className="flex-[0.5] relative h-full">
        <ManagerSignInForm />
      </Box>
    </Box>
  )
}

export default SignInLayout
