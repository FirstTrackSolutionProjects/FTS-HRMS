import { Box, TextField, Typography } from "@mui/material";
import Popup from "@/components/CustomComponents/Popup";
import CustomButton from "@/components/CustomComponents/CustomButton";
import { toast } from "react-toastify";
import { useState } from "react";
import revokeJoinUsRequestService from "@/services/joinUsRequestServices/revokeJoinUsRequestService";

const RevokeJoinUsRequestPopup = ({ open, onClose, onSubmit, requestId }) => {
    if (!open) return null;
    const [formData, setFormData] = useState({
        reason: ""
    })
    const handleSubmit = async () => {
        try {
            await revokeJoinUsRequestService(formData, requestId)
            toast.success(`Request revoked successfully!`);
            onSubmit();
        } catch (error) {
            toast.error(error?.message || `Failed to revoke request!`);
        }
    };

    return (
        <Popup open={open} close={onClose} title={`Revoke Join Us Request`}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                    Are you sure you want to revoke this join us request? This action cannot be undone.
                </Typography>

                <TextField 
                    fullWidth
                    label="Reason for Revoke"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />

                <CustomButton
                    title={'Submit'}
                    variant="contained"
                    color={'primary'}
                    disabled={!formData.reason}
                    size="small"
                    onClick={handleSubmit}
                    sx={{ width: 300 }}
                />
            </Box>
        </Popup>
    );
};

export default RevokeJoinUsRequestPopup;
