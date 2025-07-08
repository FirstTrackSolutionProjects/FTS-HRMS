import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "../../../../CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import getEmployeeCurrentPositionAndShiftService from "@/services/employeeServices/getEmployeeCurrentPositionAndShiftService"
import changeDepartmentEmployeeService from "@/services/employeeServices/changeDepartmentEmployeeService"
const ChangeDepartmentPopup = ({ open, onClose, onSubmit, employeeId }) => {
    if (!open) return;

    const {changeDepartmentFields, setChangeDepartmentFields} = useApp();

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
            await changeDepartmentEmployeeService(formData, employeeId)
            toast.success("Department changed successfully")
            onSubmit()
        } catch (err) {
            toast.error(err.message || "Failed to change Department")
        }
    }
    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Change Department"
            actions={[
                <CustomButton
                    title="Change Department"
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
                fields={changeDepartmentFields}
                setFields={setChangeDepartmentFields}
                handleSubmit={handleSubmit}
                existingData={existingData}
            />
        </ActionPopup>
    )
}

export default ChangeDepartmentPopup
