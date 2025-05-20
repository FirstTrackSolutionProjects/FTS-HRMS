import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box, useScrollTrigger } from "@mui/material"
import getShiftService from "@/services/shiftServices/getShiftService"
import updateShiftService from "@/services/shiftServices/updateShiftService"

const ViewEditShift = ({ open, onClose, onSubmit, shiftId }) => {
    if (!open) return;

    const {shiftFields, setShiftFields} = useApp();
    const formRef = useRef();

    const [viewMode, setViewMode] = useState(true);

    const [shiftData, setShiftData] = useState({});

    const getShift = async () => {
        try {
            const shift = await getShiftService(shiftId);
            setShiftData(shift);
        } catch (err) {
            toast.error(err?.message || "Failed to fetch shift data");
        }
    }

    useEffect(() => {
        if (shiftId) {
            getShift();
        }
    },[])

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        if (!formData?.batches?.length) {
            toast.error("At least one batch is required");
            return;
        }
        console.log(formData)
        
        try {
            await updateShiftService(formData?.id, formData);
            toast.success("Shift updated successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to create Shift")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="View/Edit Shift"
            actions={[
                <CustomButton
                    key="viewEdit"
                    title={viewMode ? "Edit Shift" : "Cancel"}
                    variant="contained"
                    color={viewMode ? "primary" : "error"}
                    size="small"
                    onClick={() => setViewMode((prev) => !prev)}
                />,
                !viewMode && (
                    <CustomButton
                        key="save"
                        title="Save Changes"
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={() => formRef.current?.submitForm()}
                    />
                )
            ].filter(Boolean)}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <CustomForm
                    ref={formRef}
                    fields={shiftFields}
                    setFields={setShiftFields}
                    handleSubmit={handleSubmit}
                    viewMode={viewMode}
                    existingData={shiftData}
                />
            </Box>
        </ActionPopup>
    )
}

export default ViewEditShift
