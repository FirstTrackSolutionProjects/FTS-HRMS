import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import updateProcessService from "@/services/updateProcessService"

const UpdateProcess = ({ open, onClose, onSubmit, processId, processData }) => {
    if (!open) return;

    const {processFields, setProcessFields} = useApp()
    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData
        try {
            await updateProcessService(processId, formData)
            toast.success("Process updated successfully")
            onSubmit()
        } catch (err) {
            toast.error("Failed to update Process")
        }
    }
    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Update Process"
            actions={[
                <CustomButton
                    title="Update Process"
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={formRef?.current?.loadingState?true:false}
                    onClick={()=>formRef?.current?.submitForm()}
                />
            ]}
        >
            <CustomForm
                ref={formRef}
                fields={processFields}
                setFields={setProcessFields}
                handleSubmit={handleSubmit}
                existingData={processData}
            />
        </ActionPopup>
    )
}

export default UpdateProcess
