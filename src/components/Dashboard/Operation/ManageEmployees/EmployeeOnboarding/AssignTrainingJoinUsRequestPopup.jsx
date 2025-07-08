import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box } from "@mui/material"
import assignTrainingJoinUsRequestService from "@/services/joinUsRequestServices/assignTrainingJoinUsRequestService"

const AssignTrainingJoinUsRequestPopup = ({ open, onClose, onSubmit, requestId }) => {
    if (!open) return;

    const {assignTrainingFields, setAssignTrainingFields} = useApp();
    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        console.log(formData)
        
        try {
            await assignTrainingJoinUsRequestService(formData, requestId);
            toast.success("Training assigned successfully");
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to assign training");
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Assign Training"
            actions={[
                <CustomButton
                    title="Assign"
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
                    fields={assignTrainingFields}
                    setFields={setAssignTrainingFields}
                    handleSubmit={handleSubmit}
                />
            </Box>
        </ActionPopup>
    )
}

export default AssignTrainingJoinUsRequestPopup
