import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import { Box } from "@mui/material"
import getJoinUsRequestSubmissionService from "@/services/joinUsRequestServices/getJoinUsRequestSubmissionService"

const ViewJoinUsRequestSubmission = ({ open, onClose, requestId }) => {
    if (!open) return;

    const {joinUsRequestSubmissionFields, setJoinUsRequestSubmissionFields} = useApp();
    const formRef = useRef();

    const [requestData, setRequestData] = useState({});

    const getRequestDetails = async () => {
        try {
            const data = await getJoinUsRequestSubmissionService(requestId);
            setRequestData(data);
        } catch (err) {
            toast.error(err?.message || "Failed to fetch shift data");
        }
    }

    useEffect(() => {
        if (requestId) {
            getRequestDetails();
        }
    },[])

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Join Us Submission"
            actions={[
                <CustomButton
                    key="close"
                    title={"Close"}
                    variant="contained"
                    color={"primary"}
                    size="small"
                    onClick={onClose}
                />
            ]}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <CustomForm
                    ref={formRef}
                    fields={joinUsRequestSubmissionFields}
                    setFields={setJoinUsRequestSubmissionFields}
                    handleSubmit={()=>{}}
                    viewMode={true}
                    existingData={requestData}
                />
            </Box>
        </ActionPopup>
    )
}

export default ViewJoinUsRequestSubmission
