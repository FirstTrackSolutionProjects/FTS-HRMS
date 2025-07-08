import { Stack } from '@mui/material'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ServiceTiles from '@/components/CustomComponents/ServiceTiles'
import { exitManagementServices } from '@/constants'

const ExitManagementServices = () => {
  return (
    <>
        <Stack gap={4}>
            <ComponentTitle title={`Exit Management`} />
            <ServiceTiles services={exitManagementServices} />
        </Stack>
    </>
  )
}

export default ExitManagementServices
