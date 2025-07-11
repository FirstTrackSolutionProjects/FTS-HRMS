import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box } from "@mui/material"
import onboardEmployeeJoinUsRequestService from "@/services/joinUsRequestServices/onboardEmployeeJoinUsRequestService"

const EmployeeOnboardingPopup = ({ open, onClose, onSubmit, requestId }) => {
    if (!open) return;

    const {employeeOnboardingFields, setEmployeeOnboardingFields} = useApp();
    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        console.log(formData)
        
        try {
            await onboardEmployeeJoinUsRequestService(formData, requestId);
            toast.success("Employee onboarded successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to onboard employee")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Onboard Employee"
            actions={[
                <CustomButton
                    title="Onboard"
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={formRef?.current?.loadingState?true:false}
                    onClick={()=>formRef?.current?.submitForm()}
                />
            ]}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <CustomForm
                    ref={formRef}
                    fields={employeeOnboardingFields}
                    setFields={setEmployeeOnboardingFields}
                    handleSubmit={handleSubmit}
                />
            </Box>
        </ActionPopup>
    )
}

export default EmployeeOnboardingPopup
