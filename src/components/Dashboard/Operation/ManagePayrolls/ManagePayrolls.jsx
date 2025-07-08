import { Stack } from '@mui/material'
import ComponentTitle from '@/components/CustomComponents/ComponentTitle'
import ViewPayrolls from './ViewPayrolls'

const ManagePayrolls = () => {
  return (
    <>
        <Stack gap={4}>
            <ComponentTitle title={`Manage payrolls`} />
            <ViewPayrolls />
        </Stack>
    </>
  )
}

export default ManagePayrolls