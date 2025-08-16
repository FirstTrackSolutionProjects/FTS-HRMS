import { Helmet } from "react-helmet"
import { Box, TextField, Button, Typography, Link as MuiLink } from '@mui/material'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAuth } from '@/contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { useWidth } from '@/contexts/WidthContext'
import ResetPasswordModal from '@/components/Auth/ResetPasswordModal'
const API_URL = import.meta.env.VITE_APP_API_URL

const SignInForm = () => {
  const navigate = useNavigate()
  const {width} = useWidth();
  const { login, isAuthenticated } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [resetOpen, setResetOpen] = useState(false);
  useEffect(()=>{
    if(isAuthenticated) navigate('/contact-us')
  },[isAuthenticated])
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Submit')
    try{
      const loginRequest = await fetch(`${API_URL}/auth/login`, {
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
    <Box className="flex flex-col space-y-4 md:space-y-8 h-screen relative p-4 md:p-8">
    <Typography className={`relative flex items-center justify-center font-bold text-center py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white`} sx={{fontSize:Math.max(20,width/30)}}>
    <Link to={'/'} className='flex items-center'>
        <KeyboardBackspaceIcon sx={{fontSize:Math.max(25,width/30)}} className="rounded-full border-[2px] md:border-[4px] border-white cursor-pointer absolute left-4" />
    </Link>
      Welcome Back
    </Typography>
    <Box className="flex h-full rounded-lg relative flex-col md:flex-row justify-center items-center space-x-0 space-y-4 md:space-x-4 md:space-y-0 text-white bg-gradient-to-r from-green-400 to-blue-500 py-4 md:py-8">
    <Box component={'form'} onSubmit={handleSubmit} className='flex flex-col w-[75%] items-center' gap={2}>
        <TextField
          label="Email"
          value={formData.email}
          name='email'
          onChange={handleChange}
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
              color: '#ffffff',
              opacity: 1,
            },
            width: width<768?width*0.75:width/2
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
              color: '#ffffff',
              opacity: 1,
            },
            width: width<768?width*0.75:width/2
          }}
        />
        <Button
      variant="contained"
      color="white"
      type='submit'
      sx={{
        backgroundColor: 'white',
        color:'black',
        width: width<768?width*0.75:width/2
      }}
    >
      Login
    </Button>
    <MuiLink component="button" type="button" underline="hover" sx={{ mt: 1, color: 'white', fontSize: 14 }} onClick={()=>setResetOpen(true)}>
      Forgot Password?
    </MuiLink>
      </Box>
    </Box>
    <ResetPasswordModal open={resetOpen} onClose={()=>setResetOpen(false)} />
  </Box>
  )
}


const SignIn = () => {
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()
  useEffect(()=>{
    if(isAuthenticated){
      navigate('/dashboard')
    }
  },[isAuthenticated])
  return (
    <>
    <Helmet>
      <title>Sign In | FTS HRMS</title>
      <meta name="description" content="Sign in to Full Stack Tech Solutions HRMS" />
    </Helmet>
    <SignInForm />
    </>
  )
}

export default SignIn
