import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import createDesignationService from "@/services/createDesignationService"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
const AddDesignation = ({ open, onClose, onSubmit, departmentId }) => {
    if (!open) return;

    const {designationFields, setDesignationFields} = useApp();

    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        try {
            await createDesignationService(departmentId, formData)
            toast.success("Designation created successfully")
            onSubmit()
        } catch (err) {
            toast.error("Failed to create Designation")
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
                fields={designationFields}
                setFields={setDesignationFields}
                handleSubmit={handleSubmit}
            />
        </ActionPopup>
    )
}

export default AddDesignation
