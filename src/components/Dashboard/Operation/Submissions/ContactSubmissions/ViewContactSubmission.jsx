import ActionPopup from "@/components/CustomComponents/ActionPopup"
import CustomButton from "@/components/CustomComponents/CustomButton"
import CustomForm from "@/components/CustomComponents/CustomForm"
import { useApp } from "@/contexts/AppContext"
import getEmployeeService from "@/services/getEmployeeService"
import getContactSubmissionService from "@/services/submissionServices/contactSubmissionServices/getContactSubmissionService"
import { useEffect, useRef, useState } from "react"
import { toast } from "react-toastify"

const ViewContactSubmission = ({
    open, 
    onClose, 
    onSubmit, 
    submissionId
 }) => {
    if (!open) return;
    const employeeFormRef = useRef()
    const {
        contactSubmissionFields,
        setContactSubmissionFields
    } = useApp()

    const employeeData = employeeFormRef?.current?.formData;
    const [employee, setEmployee] = useState({});
    const getEmployee = async ()=>{
        try{
            const data = await getContactSubmissionService(submissionId);
            setEmployee(data);
        } catch (err) {
            toast.error("Failed to get Contact Details")
            onClose();
        }
    }

    useEffect(()=>{
        getEmployee();
    },[])

    const handleSubmit=()=>{
        employeeFormRef?.current?.setLoadingState('Updating...');
        console.log(employeeData)
        employeeFormRef?.current?.setLoadingState(null);
    }
    return (
        <ActionPopup open={open} onClose={onClose} title="View/Edit Employee" actions={[
            <CustomButton
                title={'Close'}
                variant="contained"
                color="primary"
                size="small"
                onClick={onClose}
                sx={{ marginTop: 2, width: '100%' }}
              />
          ]}>
            <CustomForm 
              ref={employeeFormRef} 
              fields={contactSubmissionFields} 
              setFields={setContactSubmissionFields} 
              handleSubmit={handleSubmit}
              existingData={employee}
              viewMode
            />
          </ActionPopup>
    )
}

export default ViewContactSubmission