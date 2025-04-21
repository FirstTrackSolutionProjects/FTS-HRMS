import { Stack } from '@mui/material'
import React from 'react'
import ViewRoles from '@/components/Dashboard/Organization/ManageRoles/ViewRoles'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'

const Roles = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Roles`} />
      <ViewRoles />
    </Stack>
  )
}

export default Roles
