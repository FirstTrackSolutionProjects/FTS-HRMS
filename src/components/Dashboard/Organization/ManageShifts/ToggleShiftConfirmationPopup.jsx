import { Box, Typography } from "@mui/material";
import Popup from "@/components/CustomComponents/Popup";
import CustomButton from "@/components/CustomComponents/CustomButton";
import { toast } from "react-toastify";
import disableShiftService from "@/services/shiftServices/disableShiftService";
import enableShiftService from "@/services/shiftServices/enableShiftService";

const ToggleShiftConfirmationPopup = ({ open, onClose, onSubmit, shiftId, isEnabled }) => {
    if (!open) return null;
    const handleSubmit = async () => {
        try {
            if (isEnabled) {
                await disableShiftService(shiftId);
            } else {
                await enableShiftService(shiftId)
            }
            toast.success(`Shift ${isEnabled?'disabled':'enabled'} successfully!`);
            onSubmit();
        } catch (error) {
            toast.error(error?.message || `Failed to ${isEnabled?'disable':'enable'} shift!`);
        }
    };

    return (
        <Popup open={open} close={onClose} title={`${isEnabled?'Disable':'Enable'} Shift Confirmation`}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                    Are you sure you want to {isEnabled?'disable':'enable'} this shift?
                </Typography>

                <CustomButton
                    title={isEnabled?'Disable':'Enable'}
                    variant="contained"
                    color={isEnabled?'error':'success'}
                    size="small"
                    onClick={handleSubmit}
                    sx={{ width: 300 }}
                />
            </Box>
        </Popup>
    );
};

export default ToggleShiftConfirmationPopup;
