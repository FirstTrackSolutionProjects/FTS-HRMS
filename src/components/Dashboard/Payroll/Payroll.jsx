import { Stack } from '@mui/material'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ViewPayrolls from './ViewPayrolls'

const Payroll = () => {
  return (
    <>
        <Stack gap={4}>
            <ComponentTitle title={`Payroll`} />
            <ViewPayrolls />
        </Stack>
    </>
  )
}

export default Payroll