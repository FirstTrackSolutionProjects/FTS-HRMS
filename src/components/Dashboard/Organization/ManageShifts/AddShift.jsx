import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useRef } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import createShiftService from "@/services/shiftServices/createShiftService"
import { Box } from "@mui/material"

const AddShift = ({ open, onClose, onSubmit }) => {
    if (!open) return;

    const {shiftFields, setShiftFields} = useApp();
    const formRef = useRef();

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        if (!formData?.batches?.length) {
            toast.error("At least one batch is required");
            return;
        }
        console.log(formData)
        
        try {
            await createShiftService(formData, formData?.process_id);
            toast.success("Shift created successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to create Shift")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Create Shift"
            actions={[
                <CustomButton
                    title="Create Shift"
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
                    fields={shiftFields}
                    setFields={setShiftFields}
                    handleSubmit={handleSubmit}
                />
            </Box>
        </ActionPopup>
    )
}

export default AddShift
