import { Stack } from "@mui/material"
import ComponentTitle from "@/components/CustomComponents/ComponentTitle"
import ViewEmployeesSchedule from "./ViewEmployeesSchedule"


const EmployeeScheduling = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Employee Scheduling`} />
      <ViewEmployeesSchedule />
    </Stack>
  )
}

export default EmployeeScheduling
