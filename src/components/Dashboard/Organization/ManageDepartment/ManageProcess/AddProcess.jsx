import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import createProcessService from "@/services/createProcessService"

const AddProcess = ({ open, onClose, onSubmit, departmentId }) => {
    if (!open) return;

    const {processFields, setProcessFields} = useApp();

    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        try {
            await createProcessService(departmentId, formData)
            toast.success("Process created successfully")
            onSubmit()
        } catch (err) {
            toast.error("Failed to create Process")
        }
    }
    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Create Designation"
            actions={[
                <CustomButton
                    title="Create Designation"
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
            />
        </ActionPopup>
    )
}

export default AddProcess
