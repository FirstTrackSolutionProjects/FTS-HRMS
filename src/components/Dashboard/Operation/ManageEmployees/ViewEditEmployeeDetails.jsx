import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomButton from "@/components/CustomComponents/CustomButton"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import getEmployeeService from "@/services/getEmployeeService"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"

const ViewEditEmployeeDetails = ({
    open, 
    onClose, 
    onSubmit, 
    employeeId
 }) => {
    if (!open) return;
    const employeeFormRef = useRef()
    const {
        employeeFields,
        setEmployeeFields,
        refreshFormUuid
    } = useApp()

    const employeeData = employeeFormRef?.current?.formData;

    const getEmployee = async ()=>{
        try{
            const data = await getEmployeeService(employeeId);
            employeeFormRef?.current?.setFormData(data);
        } catch (err) {
            toast.error("Failed to get Employee Details")
            onClose();
        }
    }

    useEffect(()=>{
        refreshFormUuid();
        getEmployee();
    },[])

    const [loadingState, setLoadingState] = useState(null)
    const handleSubmit=()=>{
        console.log(employeeData)
    }
    return (
        <ActionPopup open={open} onClose={onClose} title="View/Edit Employee" actions={[
            <CustomButton
                title={loadingState || 'Update'}
                variant="contained"
                color="primary"
                size="small"
                disabled={loadingState?true:false}
                onClick={employeeFormRef?.current?.submitForm}
                sx={{ marginTop: 2, width: '100%' }}
              />
          ]}>
            <CustomForm 
              ref={employeeFormRef} 
              fields={employeeFields} 
              setFields={setEmployeeFields} 
              handleSubmit={handleSubmit}
              viewEditMode
            />
            {/* <PayrollTable payrollFields={payrollFields} payrollData={payrollData} setPayrollData={setPayrollData} /> */}
          </ActionPopup>
    )
}

export default ViewEditEmployeeDetails