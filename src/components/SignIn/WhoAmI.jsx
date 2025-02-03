import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import { useWidth } from '../../contexts/WidthContext';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Link, useNavigate } from 'react-router-dom';
const WhoAmI = () => {
    const {width} = useWidth();
    const navigate = useNavigate();
  return (
    <Box className="flex flex-col p-4 md:p-8">
        <Typography className={`relative flex items-center justify-center font-bold text-center py-2 px-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-lg text-white`} sx={{fontSize:Math.max(30,width/25)}}>
        <Link to={'/'} className='flex items-center'>
            <KeyboardBackspaceIcon sx={{fontSize:Math.max(30,width/30)}} className="rounded-full border-[2px] md:border-[4px] border-white cursor-pointer absolute left-4" />
        </Link>
            I AM...
        </Typography>
        <Box className="flex relative flex-col md:flex-row justify-center items-center space-x-0 space-y-4 md:space-x-4 md:space-y-0 text-white py-4 md:py-8">
            <Box className="group bg-gradient-to-r from-green-400 to-blue-500 flex w-full md:w-[50%] h-full justify-center items-center flex-col p-2 rounded-lg shadow-lg hover:bg-blue-300 transition-colors duration-500 cursor-pointer" onClick={()=>navigate('employee')}>
                <Box className="flex flex-col items-center justify-center transition-transform duration-500 group-hover:-translate-y-3">
                    <PersonIcon sx={{fontSize:Math.max(150,width/5)}} />
                    <Typography sx={{fontSize:Math.max(15,width/50), marginBottom:Math.max(1,width/500)}}>Employee</Typography>
                </Box>
            </Box>
            <Box className="group bg-gradient-to-r from-blue-400 to-green-500 flex w-full md:w-[50%] h-full justify-center items-center flex-col p-2 rounded-lg shadow-lg hover:bg-blue-300 transition-colors duration-500 cursor-pointer" onClick={()=>navigate('admin')}>
                <Box className="flex flex-col items-center justify-center transition-transform duration-500 group-hover:-translate-y-3">
                    <ManageAccountsIcon sx={{fontSize:Math.max(150,width/5)}} />
                    <Typography sx={{fontSize:Math.max(15,width/50), marginBottom:Math.max(1,width/500)}}>Admin</Typography>
                </Box>
            </Box>
        </Box>
    </Box>
  )
}

export default WhoAmI
