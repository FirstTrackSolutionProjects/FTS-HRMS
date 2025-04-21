import { Stack } from '@mui/material'
import React from 'react'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ViewDepartment from '@/components/Dashboard/Organization/ManageDepartment/ViewDepartment'

const ManageDepartment = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Manage Department`} />
      <ViewDepartment />
    </Stack>
  )
}

export default ManageDepartment
