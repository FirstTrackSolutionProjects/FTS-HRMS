import { Box, Typography } from "@mui/material";
import Popup from "@/components/CustomComponents/Popup";
import CustomButton from "@/components/CustomComponents/CustomButton";
import { toast } from "react-toastify";
import employeeJoiningJoinUsService from "@/services/joinUsRequestServices/employeeJoiningJoinUsService";

const EmployeeJoiningPopup = ({ open, onClose, onSubmit, requestId }) => {
    if (!open) return null;
    const handleSubmit = async () => {
        try {
            await employeeJoiningJoinUsService(requestId);
            toast.success("Employee Joined successfully!");
            onSubmit();
        } catch (error) {
            toast.error("Failed while joining employee!");
        }
    };

    return (
        <Popup open={open} close={onClose} title="Employee Joining Confirmation">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                    This action will create the employee account. This action should only be done on employee's first day reporting.
                </Typography>

                <CustomButton
                    title="Confirm Joining"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleSubmit}
                    sx={{ width: 300 }}
                />
            </Box>
        </Popup>
    );
};

export default EmployeeJoiningPopup;
