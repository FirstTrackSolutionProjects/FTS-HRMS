import { Box, Typography } from "@mui/material";
import Popup from "@/components/CustomComponents/Popup";
import CustomButton from "@/components/CustomComponents/CustomButton";
import { toast } from "react-toastify";
import cancelLeaveApplicationService from "@/services/leaveServices/leaveApplicationServices/cancelLeaveApplicationService";

const CancelLeaveConfirmationPopup = ({ open, onClose, onSubmit, leaveApplicationId }) => {
    if (!open) return null;
    const handleSubmit = async () => {
        try {
            await cancelLeaveApplicationService(leaveApplicationId);
            toast.success(`Application cancelled successfully!`);
            onSubmit();
        } catch (error) {
            toast.error(error?.message || `Failed to cancel application!`);
        }
    };

    return (
        <Popup open={open} close={onClose} title={`Cancel Leave Application Confirmation`}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                    Are you sure you want to cancel this leave application?
                </Typography>

                <CustomButton
                    title={'Cancel Application'}
                    variant="contained"
                    color={'error'}
                    size="small"
                    onClick={handleSubmit}
                    sx={{ width: 300 }}
                />
            </Box>
        </Popup>
    );
};

export default CancelLeaveConfirmationPopup;
