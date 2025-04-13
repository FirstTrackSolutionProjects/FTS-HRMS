import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import createDepartmentService from "@/services/createDepartmentService"
import ActionPopup from "../../../CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
const AddDepartment = ({ open, onClose, onSubmit }) => {
    if (!open) return;

    const {departmentFields, setDepartmentFields} = useApp();

    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        try {
            await createDepartmentService(formData)
            toast.success("Department created successfully")
            onSubmit()
        } catch (err) {
            toast.error("Failed to create Department")
        }
    }
    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Create Department"
            actions={[
                <CustomButton
                    title="Create Department"
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
                fields={departmentFields}
                setFields={setDepartmentFields}
                handleSubmit={handleSubmit}
            />
        </ActionPopup>
    )
}

export default AddDepartment
