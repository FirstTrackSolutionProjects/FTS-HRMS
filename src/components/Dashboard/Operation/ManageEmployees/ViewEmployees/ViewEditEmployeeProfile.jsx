import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomButton from "@/components/CustomComponents/CustomButton"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import updateEmployeeService from "@/services/employeeServices/updateEmployeeProfileService"
import getEmployeeService from "@/services/getEmployeeService"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"

const ViewEditEmployeeProfile = ({
    open, 
    onClose, 
    onSubmit, 
    employeeId
 }) => {
    if (!open) return;
    const employeeFormRef = useRef()
    const {
        employeeProfileFields,
        setEmployeeProfileFields,
        refreshFormUuid
    } = useApp()

    const employeeData = employeeFormRef?.current?.formData;
    const [employee, setEmployee] = useState({});
    const getEmployee = async ()=>{
        try{
            const data = await getEmployeeService(employeeId);
            setEmployee(data);
        } catch (err) {
            toast.error("Failed to get Employee Details")
            onClose();
        }
    }

    useEffect(()=>{
        refreshFormUuid();
        getEmployee();
    },[])

    const handleSubmit=async ()=>{
        try{
            employeeFormRef?.current?.setLoadingState('Updating...');
            const updatedData = employeeFormRef?.current?.formData;
            await updateEmployeeService(employeeId, updatedData);
            toast.success("Employee Details Updated Successfully");
            employeeFormRef?.current?.setLoadingState(null);
        } catch (err) {
            toast.error(err?.message || "Failed to update Employee Details")
        }
    }
    return (
        <ActionPopup open={open} onClose={onClose} title="View/Edit Employee Profile" actions={[
            <CustomButton
                    title="Update Profile"
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={employeeFormRef?.current?.loadingState?true:false}
                    onClick={()=>employeeFormRef?.current?.submitForm()}
                />
          ]}>
            <CustomForm 
              ref={employeeFormRef} 
              fields={employeeProfileFields} 
              setFields={setEmployeeProfileFields} 
              handleSubmit={handleSubmit}
              existingData={employee}
            />
            {/* <PayrollTable payrollFields={payrollFields} payrollData={payrollData} setPayrollData={setPayrollData} /> */}
          </ActionPopup>
    )
}

export default ViewEditEmployeeProfile