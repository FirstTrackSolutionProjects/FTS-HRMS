import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import getMyResignationApplicationService from "@/services/exitServices/resignationServices/getMyResignationApplicationService"
const ShowRequestPopup = ({ open, onClose, applicationId }) => {
    if (!open) return;

    const {changeDesignationFields, setChangeDesignationFields} = useApp();

    const [existingData, setExistingData] = useState({});

    const formRef = useRef();

    const getResignationApplication = async () => {
        try{
            const response = await getMyResignationApplicationService(applicationId)
            setExistingData(response)
        } catch(err){
            console.log(err);
            toast.error(err.message || "Something went wrong")
        }
    }
    useEffect(()=>{
        if(applicationId){
            getResignationApplication();
        }
    },[])

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Resignation Application"
            actions={[
                <CustomButton
                    title="Close"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={onClose}
                />
            ]}
        >
            <CustomForm
                ref={formRef}
                fields={changeDesignationFields}
                setFields={setChangeDesignationFields}
                existingData={existingData}
                viewMode
            />
        </ActionPopup>
    )
}

export default ShowRequestPopup
