import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box } from "@mui/material"
import updateLeavePolicyService from "@/services/leaveServices/leavePolicyServices/updateLeavePolicyService"
import getReviewLeaveApplicationService from "@/services/leaveServices/leaveApplicationServices/getReviewLeaveApplicationService"
import approveLeaveApplicationService from "@/services/leaveServices/leaveApplicationServices/approveLeaveApplicationService"
import rejectLeaveApplicationService from "@/services/leaveServices/leaveApplicationServices/rejectLeaveApplicationService"

const ReviewLeaveApplication = ({ open, onClose, onSubmit, leaveApplicationId }) => {
    if (!open) return;

    const {reviewLeaveApplicationFields, setReviewLeaveApplicationFields} = useApp();
    const formRef = useRef();
    
    const [leavePolicyData, setLeavePolicyData] = useState({});

    const getLeavePolicy = async () => {
        try {
            const leavePolicy = await getReviewLeaveApplicationService(leaveApplicationId);
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


    const approveApplication = async () => {
        try {
            await approveLeaveApplicationService(leaveApplicationId);
            toast.success("Leave Application approved successfully");
        } catch (error){
            console.log(error)
            toast.error(error?.message || "Failed to approve leave application")
        }
    }

    const rejectApplication = async () => {
        try {
            await rejectLeaveApplicationService(leaveApplicationId);
            toast.success("Leave Application rejected successfully");
        } catch (error){
            console.log(error)
            toast.error(error?.message || "Failed to reject leave application")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="View/Edit Leave Policy"
            actions={[
                <CustomButton
                    key="approve"
                    title={"Approve"}
                    variant="contained"
                    color={"primary"}
                    size="small"
                    onClick={approveApplication}
                />,
                <CustomButton
                    key="reject"
                    title={"Reject"}
                    variant="contained"
                    color={"error"}
                    size="small"
                    onClick={rejectApplication}
                />
            ]}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <CustomForm
                    ref={formRef}
                    fields={reviewLeaveApplicationFields}
                    setFields={setReviewLeaveApplicationFields}
                    handleSubmit={handleSubmit}
                    viewMode={true}
                    existingData={leavePolicyData}
                />
            </Box>
        </ActionPopup>
    )
}

export default ReviewLeaveApplication
