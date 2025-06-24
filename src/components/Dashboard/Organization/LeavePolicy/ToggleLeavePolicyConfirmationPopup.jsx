import { Box, Typography } from "@mui/material";
import Popup from "@/components/CustomComponents/Popup";
import CustomButton from "@/components/CustomComponents/CustomButton";
import { toast } from "react-toastify";
import disableLeavePolicyService from "@/services/leaveServices/leavePolicyServices/disableLeavePolicyService";
import enableLeavePolicyService from "@/services/leaveServices/leavePolicyServices/enableLeavePolicyService";

const ToggleLeavePolicyConfirmationPopup = ({ open, onClose, onSubmit, leavePolicyId, isEnabled }) => {
    if (!open) return null;
    const handleSubmit = async () => {
        try {
            if (isEnabled) {
                await disableLeavePolicyService(leavePolicyId);
            } else {
                await enableLeavePolicyService(leavePolicyId)
            }
            toast.success(`Leave Policy ${isEnabled?'disabled':'enabled'} successfully!`);
            onSubmit();
        } catch (error) {
            toast.error(error?.message || `Failed to ${isEnabled?'disable':'enable'} leave policy!`);
        }
    };

    return (
        <Popup open={open} close={onClose} title={`${isEnabled?'Disable':'Enable'} Leave Policy Confirmation`}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                    Are you sure you want to {isEnabled?'disable':'enable'} this leave policy?
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

export default ToggleLeavePolicyConfirmationPopup;
