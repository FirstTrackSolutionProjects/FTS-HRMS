import { Box, TextField, Typography } from "@mui/material";
import Popup from "@/components/CustomComponents/Popup";
import CustomButton from "@/components/CustomComponents/CustomButton";
import { toast } from "react-toastify";
import { useState } from "react";
import cancelJoinUsRequestService from "@/services/joinUsRequestServices/cancelJoinUsRequestService";

const CancelJoinUsRequestPopup = ({ open, onClose, onSubmit, requestId }) => {
    if (!open) return null;
    const [formData, setFormData] = useState({
        reason: ""
    })
    const handleSubmit = async () => {
        try {
            await cancelJoinUsRequestService(formData, requestId)
            toast.success(`Request cancelled successfully!`);
            onSubmit();
        } catch (error) {
            toast.error(error?.message || `Failed to cancel request!`);
        }
    };

    return (
        <Popup open={open} close={onClose} title={`Cancel Join Us Request`}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                    Are you sure you want to cancel this join us request?
                </Typography>

                <TextField 
                    fullWidth
                    label="Reason for cancellation"
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

export default CancelJoinUsRequestPopup;
