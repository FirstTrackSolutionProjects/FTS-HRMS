import { Stack } from "@mui/material"
import ComponentTitle from "@/components/CustomComponents/ComponentTitle"
import LeaveApplications from "./LeaveApplications"

const LeaveManagement = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Leave Applications`} />
      <LeaveApplications />
    </Stack>
  )
}

export default LeaveManagement