import { Stack, Typography } from '@mui/material'
import React from 'react'
import ViewRoles from './ViewRoles'
import ComponentTitle from '../../CustomComponents/ComponentTitle'

const ManagerDashboardRoles = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Roles`} />
      <ViewRoles />
    </Stack>
  )
}

export default ManagerDashboardRoles
