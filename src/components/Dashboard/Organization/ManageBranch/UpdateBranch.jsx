import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import updateBranchService from "@/services/updateBranchService"
import ActionPopup from "../../../CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
const UpdateBranch = ({ open, onClose, onSubmit, branchId, branchData }) => {
    if (!open) return;

    const {branchFields, setBranchFields} = useApp()
    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData
        try {
            await updateBranchService(branchId, formData)
            toast.success("Branch updated successfully")
            onSubmit()
        } catch (err) {
            toast.error("Failed to update Branch")
        }
    }
    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Update Branch"
            actions={[
                <CustomButton
                    title="Update Branch"
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
                fields={branchFields}
                setFields={setBranchFields}
                handleSubmit={handleSubmit}
                existingData={branchData}
            />
        </ActionPopup>
    )
}

export default UpdateBranch
