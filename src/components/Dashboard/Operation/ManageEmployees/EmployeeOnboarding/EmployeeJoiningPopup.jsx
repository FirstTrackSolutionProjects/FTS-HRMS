import { Box, Typography } from "@mui/material";
import CustomButton from "@/components/CustomComponents/CustomButton";
import { toast } from "react-toastify";
import employeeJoiningJoinUsService from "@/services/joinUsRequestServices/employeeJoiningJoinUsService";
import { useRef } from "react";
import { useApp } from "@/contexts/AppContext";
import ActionPopup from "@/components/CustomComponents/ActionPopup";
import CustomForm from "@/components/CustomComponents/CustomForm";

const EmployeeJoiningPopup = ({ open, onClose, onSubmit, requestId }) => {
    if (!open) return null;
    const formRef = useRef(null);
    const { employeeJoiningFields, setEmployeeJoiningFields} = useApp()
    const handleSubmit = async () => {
        try {
            const formData = formRef?.current?.formData;
            await employeeJoiningJoinUsService(requestId, formData);
            toast.success("Employee Joined successfully!");
            onSubmit();
        } catch (error) {
            toast.error("Failed while joining employee!");
        }
    };

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="Employee Joining"
            actions={[
                <CustomButton
                    title="Create Account"
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
                    fields={employeeJoiningFields}
                    setFields={setEmployeeJoiningFields}
                    handleSubmit={handleSubmit}
                />
            </Box>
        </ActionPopup>
    );
};

export default EmployeeJoiningPopup;
