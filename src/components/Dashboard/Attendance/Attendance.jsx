import { Stack } from "@mui/material"
import ComponentTitle from "@/components/CustomComponents/ComponentTitle"
import ViewAttendances from "./ViewAttendances"


const Attendance = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Attendance Report`} />
      <ViewAttendances />
    </Stack>
  )
}

export default Attendance