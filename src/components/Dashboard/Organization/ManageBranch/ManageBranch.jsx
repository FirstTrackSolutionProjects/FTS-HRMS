import { Stack } from '@mui/material'
import React from 'react'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ViewBranch from '@/components/Dashboard/Organization/ManageBranch/ViewBranch'

const ManageBranch = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Manage Branch`} />
      <ViewBranch />
    </Stack>
  )
}

export default ManageBranch
