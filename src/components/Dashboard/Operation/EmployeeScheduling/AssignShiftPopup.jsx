import CustomButton from "@/components/CustomComponents/CustomButton"
import { toast } from "react-toastify"
import { useEffect, useRef, useState } from "react"
import ActionPopup from "../../../CustomComponents/ActionPopup"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import assignShiftToEmployeeService from "@/services/shiftServices/assignShiftToEmployeeService"
import getEmployeeShiftInfoService from "@/services/shiftServices/getEmployeeShiftInfoService"
const AssignShiftPopup = ({ open, onClose, onSubmit, employeeId }) => {
    if (!open) return;

    const {assignShiftFields, setAssignShiftFields} = useApp();

    const formRef = useRef();

    const [employeeShiftInfo, setEmployeeShiftInfo] = useState({});

    const getEmployeeShiftInfo = async () => {
        try {
            const employeeShiftInfo = await getEmployeeShiftInfoService(employeeId);
            setEmployeeShiftInfo(employeeShiftInfo);
        } catch (err) {
            toast.error(err?.message || "Failed to fetch employee shift info");
        }
    }

    useEffect(() => {
        if (employeeId) {
            getEmployeeShiftInfo();
        }
    }, [])

    const handleSubmit = async () => {
        const formData = formRef?.current?.formData;
        try {
            await assignShiftToEmployeeService(formData?.shift_id, formData?.batch_id, employeeId);
            toast.success("Shift assigned successfully")
            onSubmit()
        } catch (err) {
            toast.error(err?.message || "Failed to assign Shift")
        }
    }
    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Assign Shift"
            actions={[
                <CustomButton
                    title="Assign Shift"
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
                fields={assignShiftFields}
                setFields={setAssignShiftFields}
                handleSubmit={handleSubmit}
                existingData={employeeShiftInfo}
            />
        </ActionPopup>
    )
}

export default AssignShiftPopup
