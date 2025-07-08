import ActionPopup from "@/components/CustomComponents/ActionPopup";
import CustomButton from "@/components/CustomComponents/CustomButton";
import EmployeePayrollStructure from "@/components/CustomComponents/EmployeePayrollStructure";
import getActiveJoinUsPayrollService from "@/services/joinUsRequestServices/getActiveJoinUsPayrollService";
import reviseJoinUsPayrollService from "@/services/joinUsRequestServices/reviseJoinUsPayrollService";
import { Box, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ReviseJoinUsPayrollPopup = ({ open, onClose, onSubmit, requestId }) => {
    const payrollRef = useRef();
    const [existingPayroll, setExistingPayroll] = useState(null); // Start with null
    const [formData, setFormData] = useState({ reason: "" });

    const getActiveJoinUsPayroll = async () => {
        try {
            const payroll = await getActiveJoinUsPayrollService(requestId);
            setExistingPayroll(payroll);
        } catch (err) {
            console.log(err);
            toast.error(err?.message || "Failed to load existing payroll");
        }
    };

    useEffect(() => {
        if (open) {
            getActiveJoinUsPayroll();
        }
    }, [open]);

    const handleSubmit = async () => {
        const values = payrollRef?.current?.getValues();
        try {
            await reviseJoinUsPayrollService(values, formData, requestId);
            toast.success("Payroll revised successfully");
            onSubmit();
        } catch (err) {
            toast.error(err?.message || "Failed to revise payroll");
        }
    };

    if (!open) return null;

    return (
        <ActionPopup
            open={open}
            onClose={onClose}
            title="View/Edit Payroll"
            actions={[
                <CustomButton
                    key="submit"
                    title="Create and Send"
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={handleSubmit}
                />
            ]}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Render only when data is available */}
                {existingPayroll && (
                    <EmployeePayrollStructure
                        ref={payrollRef}
                        onSubmit={handleSubmit}
                        valueMap={existingPayroll}
                    />
                )}

                <Typography variant="body1">
                    Reason for payroll revision:
                </Typography>
                <TextField
                    fullWidth
                    label="Reason for payroll revision"
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                />
            </Box>
        </ActionPopup>
    );
};

export default ReviseJoinUsPayrollPopup