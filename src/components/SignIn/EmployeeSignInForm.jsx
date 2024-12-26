import { Box, TextField, Button } from '@mui/material'
import React from 'react'

const EmployeeSignInForm = () => {
  return (
    <Box className="relative w-full h-full flex flex-col justify-center items-center" gap={2}>
      <Box className="text-center font-bold text-3xl" mb={2}>
        Welcome Back Employee
      </Box>
      <Box component={'form'} className='flex flex-col w-[75%]' gap={2}>
        <TextField
          label="Email"
          placeholder="john@example.com"
          sx={{
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white', 
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: 'white',
            },
            '& .MuiOutlinedInput-input::placeholder': {
              color: '#aaaaaa',
              opacity: 1,
            },
          }}
        />
        <TextField
          label="Password"
          placeholder="*********"
          type='password'
          sx={{
            '& .MuiInputLabel-root': {
              color: 'white',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'white',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'white', 
              },
              '&:hover fieldset': {
                borderColor: 'white',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'white',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: 'white',
            },
            '& .MuiOutlinedInput-input::placeholder': {
              color: '#aaaaaa',
              opacity: 1,
            },
          }}
        />
        <Button
      variant="contained"
      color="white"
      sx={{
        backgroundColor: 'white',
        color:'black'
      }}
    >
      Login
    </Button>
      </Box>
    </Box>
  )
}

export default EmployeeSignInForm
