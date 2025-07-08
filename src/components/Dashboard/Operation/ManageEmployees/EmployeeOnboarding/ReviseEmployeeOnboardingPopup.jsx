import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box } from "@mui/material"
import getActiveOnboardEmployeeJoinUsService from "@/services/joinUsRequestServices/getActiveOnboardEmployeeJoinUsService"
import reviseOnboardEmployeeJoinUsService from "@/services/joinUsRequestServices/reviseOnboardEmployeeJoinUsService"

const ReviseEmployeeOnboardingPopup = ({ open, onClose, onSubmit, requestId }) => {
    if (!open) return;

    const {reviseEmployeeOnboardingFields, setReviseEmployeeOnboardingFields} = useApp();
    const formRef = useRef();
    const [onboardData, setOnboardData] = useState({})

    const getActiveOnboardingData = async () => {
        try{
            const onboardingData = await getActiveOnboardEmployeeJoinUsService(requestId);
            setOnboardData(onboardingData);
        } catch (err){
            console.error(err);
            toast.error(err.message || "Failed to get onboard data");
        }
    }

    useEffect(()=>{
        getActiveOnboardingData();
    },[])

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        console.log(formData)
        try {
            await reviseOnboardEmployeeJoinUsService(formData, requestId);
            toast.success("Employee onboard revised successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to revise employee onboarding")
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Revise Onboard Employee"
            actions={[
                <CustomButton
                    title="Revise"
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
                    fields={reviseEmployeeOnboardingFields}
                    setFields={setReviseEmployeeOnboardingFields}
                    existingData={onboardData}
                    handleSubmit={handleSubmit}
                />
            </Box>
        </ActionPopup>
    )
}

export default ReviseEmployeeOnboardingPopup
