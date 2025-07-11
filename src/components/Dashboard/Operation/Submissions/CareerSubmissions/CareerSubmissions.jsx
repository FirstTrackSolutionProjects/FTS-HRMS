import { Stack } from '@mui/material'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ViewCareerSubmissions from './ViewCareerSubmissions'

const CareerSubmissions = () => {
  return (
    <>
        <Stack gap={4}>
            <ComponentTitle title={`Career Submissions`} />
            <ViewCareerSubmissions />
        </Stack>
    </>
  )
}

export default CareerSubmissions
