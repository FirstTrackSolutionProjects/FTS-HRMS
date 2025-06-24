import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box, useScrollTrigger } from "@mui/material"
import getLeavePolicyService from "@/services/leaveServices/leavePolicyServices/getLeavePolicyService"
import updateLeavePolicyService from "@/services/leaveServices/leavePolicyServices/updateLeavePolicyService"

const ViewEditLeavePolicy = ({ open, onClose, onSubmit, leavePolicyId }) => {
    if (!open) return;

    const {leavePolicyFields, setLeavePolicyFields} = useApp();
    const formRef = useRef();

    const [viewMode, setViewMode] = useState(true);

    const [leavePolicyData, setLeavePolicyData] = useState({});

    const getLeavePolicy = async () => {
        try {
            const leavePolicy = await getLeavePolicyService(leavePolicyId);
            setLeavePolicyData(leavePolicy);
        } catch (err) {
            toast.error(err?.message || "Failed to fetch leave Policy data");
        }
    }

    useEffect(() => {
        if (leavePolicyId) {
            getLeavePolicy();
        }
    },[])

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        console.log(formData)
        
        try {
            await updateLeavePolicyService(formData, leavePolicyId);
            toast.success("Leave Policy updated successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to create Leave Policy")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="View/Edit Leave Policy"
            actions={[
                <CustomButton
                    key="viewEdit"
                    title={viewMode ? "Edit Leave Policy" : "Cancel"}
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
                    fields={leavePolicyFields}
                    setFields={setLeavePolicyFields}
                    handleSubmit={handleSubmit}
                    viewMode={viewMode}
                    existingData={leavePolicyData}
                />
            </Box>
        </ActionPopup>
    )
}

export default ViewEditLeavePolicy
