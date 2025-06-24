import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box, useScrollTrigger } from "@mui/material"
import updateLeavePolicyService from "@/services/leaveServices/leavePolicyServices/updateLeavePolicyService"
import getMyLeaveApplicationService from "@/services/leaveServices/leaveApplicationServices/getMyLeaveApplicationService"

const ViewLeaveApplication = ({ open, onClose, onSubmit, leaveApplicationId }) => {
    if (!open) return;

    const {leaveApplicationFields, setLeaveApplicationFields} = useApp();
    const formRef = useRef();

    const [viewMode, setViewMode] = useState(true);

    const [leavePolicyData, setLeavePolicyData] = useState({});

    const getLeavePolicy = async () => {
        try {
            const leavePolicy = await getMyLeaveApplicationService(leaveApplicationId);
            setLeavePolicyData(leavePolicy);
        } catch (err) {
            toast.error(err?.message || "Failed to fetch leave Policy data");
        }
    }

    useEffect(() => {
        if (leaveApplicationId) {
            getLeavePolicy();
        }
    },[])

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        console.log(formData)
        
        try {
            await updateLeavePolicyService(formData, leaveApplicationId);
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
                    key="close"
                    title={"Close"}
                    variant="contained"
                    color={"primary"}
                    size="small"
                    onClick={onClose}
                />]}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <CustomForm
                    ref={formRef}
                    fields={leaveApplicationFields}
                    setFields={setLeaveApplicationFields}
                    handleSubmit={handleSubmit}
                    viewMode={true}
                    existingData={leavePolicyData}
                />
            </Box>
        </ActionPopup>
    )
}

export default ViewLeaveApplication
