import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box } from "@mui/material"
import getLeavePolicyService from "@/services/leaveServices/leaveTrackingServices/getLeavePolicyService"
import applyLeaveApplicationService from "@/services/leaveServices/leaveApplicationServices/applyLeaveApplicationService"

const LeaveApplication = ({ open, onClose, onSubmit, leaveId}) => {
    if (!open) return;

    const {leaveApplicationFields, setLeaveApplicationFields} = useApp();
    const formRef = useRef();

    const [initialLeaveData, setInitialLeaveData] = useState({});

    const getLeavePolicy = async () => {
      try{
        const response = await getLeavePolicyService(leaveId);
        const data = {
          leave_name: response.name
        }
        setInitialLeaveData(data);
      } catch (error){
        console.error(error);
        toast.error(error.message || "Error fetching leave policy");
      }
    }

    useEffect(()=>{
      getLeavePolicy();
    },[])

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        console.log(formData)
        
        try {
            await applyLeaveApplicationService(formData, leaveId);
            toast.success("Leave applied successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to apply leave")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Apply Leave"
            actions={[
                <CustomButton
                    title="Apply Leave"
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
                    fields={leaveApplicationFields}
                    setFields={setLeaveApplicationFields}
                    handleSubmit={handleSubmit}
                    existingData={initialLeaveData}
                />
            </Box>
        </ActionPopup>
    )
}

export default LeaveApplication
