import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box } from "@mui/material"
import applyResignationService from "@/services/exitServices/resignationServices/applyResignationService"

const ApplyResignationPopup = ({ open, onClose, onSubmit}) => {
    if (!open) return;

    const {applyResignationFields, setApplyResignationFields} = useApp();
    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        console.log(formData)
        
        try {
            await applyResignationService(formData);
            toast.success("Resignation applied successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to apply resignation")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Apply Resignation"
            actions={[
                <CustomButton
                    title="Apply Resignation"
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
                    fields={applyResignationFields}
                    setFields={setApplyResignationFields}
                    handleSubmit={handleSubmit}
                />
            </Box>
        </ActionPopup>
    )
}

export default ApplyResignationPopup
