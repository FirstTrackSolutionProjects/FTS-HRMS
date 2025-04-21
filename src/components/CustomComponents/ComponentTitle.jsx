import { Box, Typography } from '@mui/material'
import React from 'react'
import { useWidth } from '@/contexts/WidthContext'
const ComponentTitle = ({title}) => {
    const {width} = useWidth()
  return (
    <Box className={`w-full flex justify-center items-center py-4`}>
        <Typography
            sx={{
                paddingX: width/120,
                paddingY: width/600,
                fontSize: Math.max(width/50,15)
            }}
            className='bg-gradient-to-br from-blue-700 to-blue-400 rounded-lg text-center text-white'
        >
        {title}
        </Typography>
    </Box>
  )
}

export default ComponentTitle
