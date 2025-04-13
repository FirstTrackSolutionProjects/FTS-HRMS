import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import createBranchService from "@/services/createBranchService"
import ActionPopup from "../../../CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
const AddBranch = ({ open, onClose, onSubmit }) => {
    if (!open) return;

    const {branchFields, setBranchFields} = useApp();

    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        try {
            await createBranchService(formData)
            toast.success("Branch created successfully")
            onSubmit()
        } catch (err) {
            toast.error("Failed to create Branch")
        }
    }
    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Create Branch"
            actions={[
                <CustomButton
                    title="Create Branch"
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
            />
        </ActionPopup>
    )
}

export default AddBranch
