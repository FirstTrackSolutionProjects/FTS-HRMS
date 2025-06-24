import { Box, TextField, Typography } from "@mui/material";
import Popup from "@/components/CustomComponents/Popup";
import CustomButton from "@/components/CustomComponents/CustomButton";
import { toast } from "react-toastify";
import { useState } from "react";
import reAttemptJoinUsRequestService from "@/services/joinUsRequestServices/reAttemptJoinUsRequestService";

const ReattemptJoinUsRequestPopup = ({ open, onClose, onSubmit, requestId }) => {
    if (!open) return null;
    const [formData, setFormData] = useState({
        reason: ""
    })
    const handleSubmit = async () => {
        try {
            await reAttemptJoinUsRequestService(formData, requestId)
            toast.success(`Reattempt requested successfully!`);
            onSubmit();
        } catch (error) {
            toast.error(error?.message || `Failed to request reattempt!`);
        }
    };

    return (
        <Popup open={open} close={onClose} title={`Join Us Reattempt Request`}>
            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
                <Typography variant="body1">
                    Are you sure you want to request a reattempt? Current submission will be discarded.
                </Typography>

                <TextField 
                    fullWidth
                    label="Reason for Reattempt Request"
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

export default ReattemptJoinUsRequestPopup;
