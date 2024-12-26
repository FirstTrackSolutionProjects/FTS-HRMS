import { Box, TextField, Button } from '@mui/material'
import React from 'react'

const ManagerSignInForm = () => {
  return (
    <Box className="relative w-full h-full flex flex-col justify-center items-center" gap={2}>
      <Box className="text-center font-bold text-3xl" mb={2}>
        Welcome Back Manager
      </Box>
      <Box component={'form'} className='flex flex-col w-[75%]' gap={2}>
        <TextField
          label="Email"
          placeholder="john@example.com"
          sx={{
            '& .MuiInputLabel-root': {
              color: 'black',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'black',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black', 
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: 'black',
            },
            '& .MuiOutlinedInput-input::placeholder': {
              color: '#aaaaaa',
              opacity: 1,
            },
          }}
        />
        <TextField
          label="Password"
          placeholder="**********"
          type="password"
          sx={{
            '& .MuiInputLabel-root': {
              color: 'black',
            },
            '& .MuiInputLabel-root.Mui-focused': {
              color: 'black',
            },
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'black', 
              },
              '&:hover fieldset': {
                borderColor: 'black',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'black',
              },
            },
            '& .MuiOutlinedInput-input': {
              color: 'black',
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

export default ManagerSignInForm
