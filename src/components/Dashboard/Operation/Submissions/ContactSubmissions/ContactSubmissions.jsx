import { Stack } from '@mui/material'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ViewContactSubmissions from './ViewContactSubmissions'

const ContactSubmissions = () => {
  return (
    <>
        <Stack gap={4}>
            <ComponentTitle title={`Contact Submissions`} />
            <ViewContactSubmissions />
        </Stack>
    </>
  )
}

export default ContactSubmissions
