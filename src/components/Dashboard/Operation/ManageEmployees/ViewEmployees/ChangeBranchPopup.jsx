import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "../../../../CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import getEmployeeCurrentPositionAndShiftService from "@/services/employeeServices/getEmployeeCurrentPositionAndShiftService"
import changeBranchEmployeeService from "@/services/employeeServices/changeBranchEmployeeService"
const ChangeBranchPopup = ({ open, onClose, onSubmit, employeeId }) => {
    if (!open) return;

    const {changeBranchFields, setChangeBranchFields} = useApp();

    const [existingData, setExistingData] = useState({});

    const formRef = useRef();

    const getEmployeeCurrentPosition = async () => {
        try{
            const response = await getEmployeeCurrentPositionAndShiftService(employeeId)
            setExistingData(response)
        } catch(err){
            console.log(err);
            toast.error(err.message || "Something went wrong")
        }
    }
    useEffect(()=>{
        if(employeeId){
            getEmployeeCurrentPosition();
        }
    },[])

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        try {
            await changeBranchEmployeeService(formData, employeeId)
            toast.success("Branch changed successfully")
            onSubmit()
        } catch (err) {
            toast.error(err.message || "Failed to change Branch")
        }
    }
    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Change Branch"
            actions={[
                <CustomButton
                    title="Change Branch"
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={formRef?.current?.loadingState?true:false}
                    onClick={()=>formRef?.current?.submitForm()}
                />
            ]}
        >
            <CustomForm
                ref={formRef}
                fields={changeBranchFields}
                setFields={setChangeBranchFields}
                handleSubmit={handleSubmit}
                existingData={existingData}
            />
        </ActionPopup>
    )
}

export default ChangeBranchPopup
