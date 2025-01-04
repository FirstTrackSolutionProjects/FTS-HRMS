import { Box, TextField, Button } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
const API_URL = import.meta.env.VITE_APP_API_URL

const ManagerSignInForm = () => {
  const navigate = useNavigate()
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  useEffect(()=>{
    if(isAuthenticated) navigate('/contact-us')
  },[isAuthenticated])
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Submit')
    try{
      const loginRequest = await fetch(`${API_URL}/auth/manager-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (!loginRequest.ok) {
        throw new Error('Failed to login')
      }
      toast.success("Loginned")
      const data = await loginRequest.json()
      const token = data.token;
      login(token);
    } catch (e) {
      toast.error(e || 'Unexpected error');
    }
  }

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value })
  }
  return (
    <Box className="relative w-full h-full flex flex-col justify-center items-center" gap={2}>
      <Box className="text-center font-bold text-3xl" mb={2}>
        Welcome Back Manager
      </Box>
      <Box component={'form'} onSubmit={handleSubmit} className='flex flex-col w-[75%]' gap={2}>
        <TextField
          label="Email"
          value={formData.email}
          name='email'
          onChange={handleChange}
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
          value={formData.password}
          onChange={handleChange}
          name='password'
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
      type='submit'
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
