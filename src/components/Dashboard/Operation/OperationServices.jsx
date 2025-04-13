import { Stack } from '@mui/material'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ServiceTiles from '@/components/CustomComponents/ServiceTiles'
import { operationServices } from '@/constants'

const OperationServices = () => {
  return (
    <>
        <Stack gap={4}>
            <ComponentTitle title={`Operation`} />
            <ServiceTiles services={operationServices} />
        </Stack>
    </>
  )
}

export default OperationServices
