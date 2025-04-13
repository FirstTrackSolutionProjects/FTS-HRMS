import { Box, Typography } from "@mui/material";
import Popup from "@/components/CustomComponents/Popup";
import CustomButton from "@/components/CustomComponents/CustomButton";
import deleteRoleService from "@/services/deleteRoleService";
import { toast } from "react-toastify";

const DeleteRoleConfirmationPopup = ({ open, onClose, onSubmit, roleId }) => {
    if (!open) return null;
    const handleSubmit = async () => {
        try {
            await deleteRoleService(roleId);
            toast.success("Role deleted successfully!");
            onSubmit();
        } catch (error) {
            toast.error("Failed to delete role.");
        }
    };

    return (
        <Popup open={open} close={onClose} title="Delete Role Confirmation">
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                    Are you sure you want to delete this role? This action cannot be undone.
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

export default DeleteRoleConfirmationPopup;
