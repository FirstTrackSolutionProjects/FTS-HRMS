import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box } from "@mui/material"
import createJoinUsRequestService from "@/services/joinUsRequestServices/createJoinUsRequestService"

const CreateJoinUsRequest = ({ open, onClose, onSubmit }) => {
    if (!open) return;

    const {createJoinUsRequestFields, setCreateJoinUsRequestFields} = useApp();
    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        console.log(formData)
        
        try {
            await createJoinUsRequestService(formData);
            toast.success("Join Us Request created successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to create Join Us Request")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Create Join Us Request"
            actions={[
                <CustomButton
                    title="Create Request"
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
                    fields={createJoinUsRequestFields}
                    setFields={setCreateJoinUsRequestFields}
                    handleSubmit={handleSubmit}
                />
            </Box>
        </ActionPopup>
    )
}

export default CreateJoinUsRequest
