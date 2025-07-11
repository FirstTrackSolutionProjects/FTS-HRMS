import { Stack } from '@mui/material'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ServiceTiles from '@/components/CustomComponents/ServiceTiles'
import { submissionServices } from '@/constants'

const SubmissionServices = () => {
  return (
    <>
        <Stack gap={4}>
            <ComponentTitle title={`Submissions`} />
            <ServiceTiles services={submissionServices} />
        </Stack>
    </>
  )
}

export default SubmissionServices
