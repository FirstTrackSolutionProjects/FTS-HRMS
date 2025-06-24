import { Stack } from "@mui/material"
import ComponentTitle from "@/components/CustomComponents/ComponentTitle"
import ViewJoinUsRequests from "./ViewJoinUsRequests"


const EmployeeOnboarding = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Employee Onboarding`} />
      <ViewJoinUsRequests />
    </Stack>
  )
}

export default EmployeeOnboarding
