import { Box } from '@mui/material'
import React from 'react'
import ServiceTile from '@/components/CustomComponents/ServiceTile'

const ServiceTiles = ({ services }) => {
  return (
    <Box padding={4} display={'flex'} gap={2} flexWrap={'wrap'} justifyContent={'center'}>
      {services.map((service, index)=>(
        <ServiceTile key={index} service={service} />
      ))}
    </Box>
  )
}

export default ServiceTiles
