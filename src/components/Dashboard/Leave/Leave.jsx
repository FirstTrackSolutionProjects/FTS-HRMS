import { Stack } from '@mui/material'
import React from 'react'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import LeaveTiles from '@/components/CustomComponents/LeaveTiles'
import LeaveApplications from './LeaveApplications'
// import ViewLeavePolicy from './ViewLeavePolicy'

const Leave = () => {
  return (
    <Stack gap={0}>
      <ComponentTitle title={`Leave Tracking`} />
      <LeaveTiles />
      <LeaveApplications />
    </Stack>
  )
}

export default Leave
