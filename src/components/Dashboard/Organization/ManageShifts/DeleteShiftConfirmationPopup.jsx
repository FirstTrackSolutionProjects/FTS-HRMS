import { Box, Typography } from "@mui/material";
import Popup from "@/components/CustomComponents/Popup";
import CustomButton from "@/components/CustomComponents/CustomButton";
import deleteRoleService from "@/services/deleteRoleService";
import { toast } from "react-toastify";
import deleteShiftService from "@/services/shiftServices/deleteShiftService";

const DeleteShiftConfirmationPopup = ({ open, onClose, onSubmit, shiftId }) => {
    if (!open) return null;
    const handleSubmit = async () => {
        try {
            await deleteShiftService(shiftId);
            toast.success("Shift deleted successfully!");
            onSubmit();
        } catch (error) {
            toast.error("Failed to delete shift.");
        }
    };

    return (
        <Popup open={open} close={onClose} title="Delete Shift Confirmation">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                    Are you sure you want to delete this shift? This action cannot be undone. All employees assigned to this shift will have to be reassign to another shift.
                </Typography>

                <CustomButton
                    title="Delete"
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={handleSubmit}
                    sx={{ width: 300 }}
                />
            </Box>
        </Popup>
    );
};

export default DeleteShiftConfirmationPopup;
