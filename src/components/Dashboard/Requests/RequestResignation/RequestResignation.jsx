import { Stack } from '@mui/material'
import React from 'react'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ViewRequestResignation from './ViewRequestResignation'

const RequestResignation = () => {
  return (
    <Stack gap={0}>
      <ComponentTitle title={`Resignation`} />
      <ViewRequestResignation />
    </Stack>
  )
}

export default RequestResignation
