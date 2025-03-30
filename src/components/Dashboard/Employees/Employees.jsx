import { Stack } from "@mui/material"
import ComponentTitle from "../../CustomComponents/ComponentTitle"
import ViewEmployees from "./ViewEmployees"


const Employees = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Employees`} />
      <ViewEmployees />
    </Stack>
  )
}

export default Employees
