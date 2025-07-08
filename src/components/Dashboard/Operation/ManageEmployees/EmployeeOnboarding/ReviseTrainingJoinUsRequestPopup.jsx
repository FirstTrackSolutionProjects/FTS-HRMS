import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box } from "@mui/material"
import reviseTrainingJoinUsRequestService from "@/services/joinUsRequestServices/reviseTrainingJoinUsRequestService"
import getActiveTrainingJoinUsService from "@/services/joinUsRequestServices/getActiveTrainingJoinUsService"

const ReviseTrainingJoinUsRequestPopup = ({ open, onClose, onSubmit, requestId }) => {
    if (!open) return;

    const {reviseTrainingFields, setReviseTrainingFields} = useApp();
    const [trainingData, setTrainingData] = useState({});
    const formRef = useRef();

    const getActiveTrainingData = async () => {
        try{
            const trainingData = await getActiveTrainingJoinUsService(requestId);
            setTrainingData(trainingData);
        } catch (err){
            console.error(err);
            toast.error(err.message || "Failed to get training data");
        }
    }

    useEffect(()=>{
        getActiveTrainingData();
    },[])

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        console.log(formData)
        
        try {
            await reviseTrainingJoinUsRequestService(formData, requestId);
            toast.success("Training revised successfully");
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to revise training");
        }
    }

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Revise Training"
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
                    fields={reviseTrainingFields}
                    setFields={setReviseTrainingFields}
                    existingData={trainingData}
                    handleSubmit={handleSubmit}
                />
            </Box>
        </ActionPopup>
    )
}

export default ReviseTrainingJoinUsRequestPopup
