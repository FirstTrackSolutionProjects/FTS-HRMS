import { Stack } from "@mui/material"
import ComponentTitle from "@/components/CustomComponents/ComponentTitle"
import ViewShifts from "./ViewShifts"


const ManageShifts = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Manage Shifts`} />
      <ViewShifts />
    </Stack>
  )
}

export default ManageShifts
