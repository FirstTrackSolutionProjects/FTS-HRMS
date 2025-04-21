import { Stack } from '@mui/material'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ServiceTiles from '@/components/CustomComponents/ServiceTiles'
import { organizationServices } from '@/constants'

const OrganizationServices = () => {
  return (
    <>
        <Stack gap={4}>
            <ComponentTitle title={`Organization`} />
            <ServiceTiles services={organizationServices} />
        </Stack>
    </>
  )
}

export default OrganizationServices
