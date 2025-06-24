import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import createLeavePolicyService from "@/services/leaveServices/leavePolicyServices/createLeavePolicyService"
import { Box } from "@mui/material"

const AddLeavePolicy = ({ open, onClose, onSubmit }) => {
    if (!open) return;

    const {leavePolicyFields, setLeavePolicyFields} = useApp();
    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        console.log(formData)
        
        try {
            await createLeavePolicyService(formData);
            toast.success("Leave Policy created successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to create Leave Policy")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Create Leave Policy"
            actions={[
                <CustomButton
                    title="Create Policy"
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
                    fields={leavePolicyFields}
                    setFields={setLeavePolicyFields}
                    handleSubmit={handleSubmit}
                />
            </Box>
        </ActionPopup>
    )
}

export default AddLeavePolicy
