import { Box, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PersonIcon from '@mui/icons-material/Person';
import { useWidth } from '../../contexts/WidthContext';
const WhoAmI = () => {
    const {width} = useWidth();
  return (
    <Box className="flex flex-col" p={4}>
        <Typography className={`font-bold text-center`} sx={{fontSize:width/25}}>
            I AM...
        </Typography>
        <Box className="flex relative flex-col md:flex-row justify-center items-center space-x-0 space-y-4 md:space-x-4 md:space-y-0" py={4}>
            <Box className="group flex w-full md:w-[50%] h-full justify-center items-center flex-col p-2 border-2 rounded-lg border-black shadow-lg hover:bg-blue-300 transition-colors duration-500">
                <Box className="flex flex-col items-center justify-center transition-transform duration-500 group-hover:-translate-y-6">
                    <PersonIcon sx={{fontSize:Math.max(150,width/5)}} />
                    <Typography sx={{fontSize:Math.max(15,width/50), marginBottom:Math.max(1,width/500)}}>Employee</Typography>
                </Box>
            </Box>
            <Box className="group flex w-full md:w-[50%] h-full justify-center items-center flex-col p-2 border-2 rounded-lg border-black shadow-lg hover:bg-blue-300 transition-colors duration-500">
                <Box className="flex flex-col items-center justify-center transition-transform duration-500 group-hover:-translate-y-6">
                    <ManageAccountsIcon sx={{fontSize:Math.max(150,width/5)}} />
                    <Typography sx={{fontSize:Math.max(15,width/50), marginBottom:Math.max(1,width/500)}}>Admin</Typography>
                </Box>
            </Box>
        </Box>
    </Box>
  )
}

export default WhoAmI
