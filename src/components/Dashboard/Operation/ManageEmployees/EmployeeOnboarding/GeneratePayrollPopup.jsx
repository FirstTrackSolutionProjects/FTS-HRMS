import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import createShiftService from "@/services/shiftServices/createShiftService"
import { Box } from "@mui/material"
import EmployeePayrollStructure from "@/components/CustomComponents/EmployeePayrollStructure"
import generatePayrollService from "@/services/joinUsRequestServices/generatePayrollService"

const GeneratePayrollPopup = ({ open, onClose, onSubmit, requestId }) => {
    if (!open) return;
    const payrollRef = useRef()

    const handleSubmit = async () => {
        const values = payrollRef?.current?.getValues();
        try {
            await generatePayrollService(values, requestId);
            toast.success("Payroll generated successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to generate payroll")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Generate Payroll"
            actions={[
                <CustomButton
                    title="Create and Send"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={()=>payrollRef?.current?.submitForm()}
                />
            ]}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <EmployeePayrollStructure ref={payrollRef} onSubmit={handleSubmit} />
            </Box>
        </ActionPopup>
    )
}

export default GeneratePayrollPopup
