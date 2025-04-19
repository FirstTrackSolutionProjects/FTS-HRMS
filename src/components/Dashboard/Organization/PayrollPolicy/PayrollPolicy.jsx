import ComponentTitle from "@/components/CustomComponents/ComponentTitle"
import { Stack } from "@mui/material"
import ViewEditPayrollPolicy from "@/components/Dashboard/Organization/PayrollPolicy/ViewEditPayrollPolicy"

const PayrollPolicy = () => {
  return (
    <Stack gap={4}>
      <ComponentTitle title={`Payroll Policy`} />
      <ViewEditPayrollPolicy />
    </Stack>
  )
}

export default PayrollPolicy
