import { Stack } from '@mui/material'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ServiceTiles from '@/components/CustomComponents/ServiceTiles'
import { requestsServices } from '@/constants'

const RequestsServices = () => {
  return (
    <>
        <Stack gap={4}>
            <ComponentTitle title={`Operation`} />
            <ServiceTiles services={requestsServices} />
        </Stack>
    </>
  )
}

export default RequestsServices
