import { Stack } from '@mui/material'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ServiceTiles from '@/components/CustomComponents/ServiceTiles'
import { manageEmployeeServices } from '@/constants'

const ManageEmployeeServices = () => {
  return (
    <>
        <Stack gap={4}>
            <ComponentTitle title={`Employee Manage`} />
            <ServiceTiles services={manageEmployeeServices} />
        </Stack>
    </>
  )
}

export default ManageEmployeeServices
