import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import updateDesignationService from "@/services/updateDesignationService"
const UpdateDesignation = ({ open, onClose, onSubmit, designationId, designationData }) => {
    if (!open) return;

    const {designationFields, setDesignationFields} = useApp()
    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData
        try {
            await updateDesignationService(designationId, formData)
            toast.success("Designation updated successfully")
            onSubmit()
        } catch (err) {
            toast.error("Failed to update Designation")
        }
    }
    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Update Designation"
            actions={[
                <CustomButton
                    title="Update Designation"
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
                fields={designationFields}
                setFields={setDesignationFields}
                handleSubmit={handleSubmit}
                existingData={designationData}
            />
        </ActionPopup>
    )
}

export default UpdateDesignation
