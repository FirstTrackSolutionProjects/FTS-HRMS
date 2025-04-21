import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import updateDepartmentService from "@/services/updateDepartmentService"
import ActionPopup from "../../../CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
const UpdateDepartment = ({ open, onClose, onSubmit, departmentId, departmentData }) => {
    if (!open) return;

    const {departmentFields, setDepartmentFields} = useApp()
    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData
        try {
            await updateDepartmentService(departmentId, formData)
            toast.success("Department updated successfully")
            onSubmit()
        } catch (err) {
            toast.error("Failed to update Department")
        }
    }
    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Update Department"
            actions={[
                <CustomButton
                    title="Update Department"
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
                existingData={departmentData}
            />
        </ActionPopup>
    )
}

export default UpdateDepartment
