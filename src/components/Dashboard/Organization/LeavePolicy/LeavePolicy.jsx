import { Stack } from '@mui/material'
import React from 'react'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ViewLeavePolicy from './ViewLeavePolicy'

const LeavePolicy = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Leave Policy`} />
      <ViewLeavePolicy />
    </Stack>
  )
}

export default LeavePolicy
